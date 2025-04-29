// 搜索功能实现
import { useState, useEffect, useCallback } from 'react';
import { searchPosts, sortPostsByRelevance } from '@/lib/content';

export const safeTagsMatch = (post: any, keyword: string): boolean => {
  if (!post?.data?.tags || !Array.isArray(post.data.tags)) return false;
  return post.data.tags.some((tag: string) => 
    tag.toLowerCase().includes(keyword.toLowerCase())
  );
};

export const useSearch = (allPosts: any[]) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const performSearch = useCallback(
    (searchQuery: string) => {
      const timer = setTimeout(() => {
        if (!searchQuery.trim()) {
          setResults([]);
          setIsSearching(false);
          return;
        }
        
        setIsSearching(true);
        
        const searchResults = sortPostsByRelevance(
          searchPosts(allPosts, searchQuery),
          searchQuery
        );
        
        setResults(searchResults);
        setIsSearching(false);
      }, 300);
      
      return () => clearTimeout(timer);
    },
    [allPosts]
  );
  
  useEffect(() => {
    const cleanup = performSearch(query);
    return cleanup;
  }, [query, performSearch]);
  
  const resetSearch = () => {
    setQuery('');
    setResults([]);
  };
  
  return {
    query,
    setQuery,
    results,
    isSearching,
    resetSearch,
  };
};

export const highlightSearchResults = (text: string, query: string): string => {
  if (!query.trim() || !text) return text;
  
  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  let highlightedText = text;
  
  searchTerms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
  });
  
  return highlightedText;
};

export const generateSearchSuggestions = (
  allPosts: any[],
  query: string,
  limit: number = 5
): string[] => {
  if (!query.trim()) return [];
  
  const titles = allPosts.map(post => post.data.title || '');
  const tags = allPosts.flatMap(post => post.data.tags || []);
  
  const allTerms = Array.from(new Set([...titles, ...tags]));
  
  const matchingTerms = allTerms.filter(term => 
    term.toLowerCase().includes(query.toLowerCase())
  );
  
  return matchingTerms
    .sort((a, b) => a.length - b.length)
    .slice(0, limit);
};

// 搜索历史管理工具
// 提供博客站点的搜索历史记录功能

/**
 * 搜索历史管理
 * 用于保存和获取用户搜索历史
 */
export const searchHistory = {
  /**
   * 获取搜索历史
   * @returns 搜索历史数组
   */
  get: (): string[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const history = localStorage.getItem('searchHistory');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Failed to get search history:', error);
      return [];
    }
  },
  
  /**
   * 添加搜索历史
   * @param query 搜索关键词
   */
  add: (query: string): void => {
    if (typeof window === 'undefined' || !query.trim()) return;
    
    try {
      const history = searchHistory.get();
      
      const filteredHistory = history.filter(item => item !== query);
      
      const newHistory = [query, ...filteredHistory].slice(0, 10);
      
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to add search history:', error);
    }
  },
  
  /**
   * 清除搜索历史
   */
  clear: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem('searchHistory');
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  },
};
