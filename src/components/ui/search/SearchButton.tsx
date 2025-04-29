import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { searchHistory } from '@/lib/search';

interface SearchButtonProps {
  className?: string;
}

// 提取搜索图标为独立组件，添加className支持
const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
);

const SearchButton: React.FC<SearchButtonProps> = ({ className = '' }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistoryItems, setSearchHistoryItems] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // 加载搜索历史
  useEffect(() => {
    setSearchHistoryItems(searchHistory.get());
  }, []);
  
  // 打开搜索框
  const openSearch = () => {
    setIsSearchOpen(true);
    // 确保页面不能滚动
    document.body.style.overflow = 'hidden';
    
    // 重新获取最新的搜索历史
    setSearchHistoryItems(searchHistory.get());
    
    // 使用setTimeout确保DOM更新后再聚焦
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 10);
  };
  
  // 关闭搜索框
  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    // 恢复页面滚动
    document.body.style.overflow = '';
  };
  
  // 处理搜索提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchHistory.add(searchQuery);
      // 使用简单的表单提交而不是JavaScript跳转
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      closeSearch();
    }
  };
  
  // 点击搜索历史记录
  const handleHistoryClick = (query: string) => {
    searchHistory.add(query);
    window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    closeSearch();
  };
  
  // 处理快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC键关闭搜索框
      if (e.key === 'Escape' && isSearchOpen) {
        e.preventDefault();
        closeSearch();
      }
      
      // /键快捷打开搜索(仅在非输入元素中触发)
      if (e.key === '/' && !isSearchOpen && 
          !(e.target instanceof HTMLInputElement) && 
          !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        openSearch();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);
  
  return (
    <>
      {/* 搜索按钮 */}
      <button
        onClick={openSearch}
        className={cn(
          "inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
          className
        )}
        aria-label="搜索"
      >
        <SearchIcon />
      </button>
      
      {/* 搜索弹出层 */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="flex items-start justify-center pt-20 px-4">
            <div className="relative w-full max-w-lg animate-slide-in-from-top">
              <div className="border bg-background rounded-lg shadow-lg overflow-hidden">
                {/* 搜索表单 */}
                <form onSubmit={handleSubmit} className="block">
                  <div className="flex items-center px-4">
                    <SearchIcon className="text-muted-foreground" />
                    
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="搜索文章..."
                      className="flex-1 py-4 px-2 bg-transparent border-0 outline-none text-foreground"
                      autoComplete="off"
                    />
                    
                    <button
                      type="button"
                      onClick={closeSearch}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="关闭"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </button>
                  </div>
                </form>
                
                {/* 搜索历史 - 仅在有历史记录且无搜索词时显示 */}
                {searchHistoryItems.length > 0 && !searchQuery && (
                  <div className="px-4 py-2 border-t">
                    <p className="text-xs text-muted-foreground mb-2">搜索历史</p>
                    <div className="flex flex-wrap gap-2">
                      {searchHistoryItems.map((item, i) => (
                        <button
                          key={i}
                          className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded-md"
                          onClick={() => handleHistoryClick(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 搜索提示 */}
                <div className="px-4 py-2 text-xs text-muted-foreground border-t">
                  <span>按 Enter 搜索，按 ESC 关闭</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchButton;

// 为TypeScript扩展Window接口，添加Pagefind相关
declare global {
  interface Window {
    pagefind?: any;
  }
}