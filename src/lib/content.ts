// 内容管理工具函数
// 提供文章处理、分页、搜索等功能的工具函数

/**
 * 计算文章阅读时间
 * @param content 文章内容
 * @param wordsPerMinute 每分钟阅读字数
 * @returns 阅读时间（分钟）
 */
export const calculateReadingTime = (content: string, wordsPerMinute: number = 200): number => {
  if (!content) return 0;
  
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  return Math.max(1, readingTime);
};

/**
 * 生成文章摘要
 * @param content 文章内容
 * @param maxLength 最大长度
 * @returns 文章摘要
 */
export const generateExcerpt = (content: string, maxLength: number = 200): string => {
  if (!content) return '';
  
  // 移除Markdown语法
  const plainText = content
    .replace(/!\[.*?\]\(.*?\)/g, '') // 图片
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1') // 链接
    .replace(/[*_]{1,3}(.*?)[*_]{1,3}/g, '$1') // 强调
    .replace(/#{1,6}\s+(.*)/g, '$1') // 标题
    .replace(/```[\s\S]*?```/g, '') // 代码块
    .replace(/`([^`]+)`/g, '$1') // 行内代码
    .replace(/(?:^|\n)>\s+(.*)/g, '$1') // 引用
    .replace(/(?:^|\n)(?:[*+-]|\d+\.)\s+(.*)/g, '$1') // 列表
    .replace(/(?:^|\n)(?:-{3,}|={3,})/g, '') // 分隔线
    .replace(/\n/g, ' ') // 换行转换为空格
    .trim();
  
  // 截断文本并确保不会在单词中间截断
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  let excerpt = plainText.substring(0, maxLength);
  const lastSpaceIndex = excerpt.lastIndexOf(' ');
  
  if (lastSpaceIndex > 0) {
    excerpt = excerpt.substring(0, lastSpaceIndex);
  }
  
  return excerpt + '...';
};

/**
 * 格式化日期
 * @param date 日期对象或日期字符串
 * @param locale 地区设置
 * @param options 格式化选项
 * @returns 格式化后的日期字符串
 */
export const formatDate = (
  date: Date | string,
  locale: string = 'zh-CN',
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

/**
 * 按年份对文章进行归档
 * @param posts 文章数组
 * @returns 按年份归档的文章对象
 */
export const archivePostsByYear = (posts: any[]): Record<number, any[]> => {
  const archives: Record<number, any[]> = {};
  
  posts.forEach(post => {
    const dateStr = post.data.pubDate;
    if (!dateStr) return;
    
    const date = new Date(dateStr);
    const year = date.getFullYear();
    
    if (!archives[year]) {
      archives[year] = [];
    }
    
    archives[year].push(post);
  });
  
  // 对每年内的文章按日期排序
  Object.keys(archives).forEach(year => {
    archives[Number(year)].sort((a, b) => {
      return new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime();
    });
  });
  
  return archives;
};

/**
 * 提取文章中的所有标签
 * @param posts 文章数组
 * @returns 标签数组，包含标签名称和文章数量
 */
export const extractTags = (posts: any[]): { name: string; count: number }[] => {
  const tagCounts: Record<string, number> = {};
  
  posts.forEach(post => {
    const tags = post.data.tags || [];
    tags.forEach((tag: string) => {
      if (tagCounts[tag]) {
        tagCounts[tag]++;
      } else {
        tagCounts[tag] = 1;
      }
    });
  });
  
  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

/**
 * 分页处理
 * @param items 要分页的项目数组
 * @param page 当前页码
 * @param pageSize 每页项目数
 * @returns 分页结果对象
 */
export const paginate = <T>(
  items: T[],
  page: number = 1,
  pageSize: number = 12
): {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
} => {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    items: items.slice(startIndex, endIndex),
    page: currentPage,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

/**
 * 搜索文章
 * @param posts 文章数组
 * @param query 搜索关键词
 * @returns 搜索结果数组
 */
export const searchPosts = (posts: any[], query: string): any[] => {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  
  return posts.filter(post => {
    const title = post.data.title?.toLowerCase() || '';
    const description = post.data.description?.toLowerCase() || '';
    const content = post.body?.toLowerCase() || '';
    
    let tagsMatch = false;
    if (post.data.tags && Array.isArray(post.data.tags) && post.data.tags.length > 0) {
      const tags = post.data.tags.map((tag: string) => tag.toLowerCase());
      tagsMatch = searchTerms.some(term => 
        tags.some((tag: string) => tag.includes(term))
      );
    }
    
    return searchTerms.every(term => {
      return (
        title.includes(term) ||
        description.includes(term) ||
        content.includes(term) ||
        tagsMatch
      );
    });
  });
};

/**
 * 按相关性排序搜索结果
 * @param posts 搜索结果文章数组
 * @param query 搜索关键词
 * @returns 按相关性排序的文章数组
 */
export const sortPostsByRelevance = (posts: any[], query: string): any[] => {
  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  
  return [...posts].sort((a, b) => {
    const aTitle = a.data.title?.toLowerCase() || '';
    const bTitle = b.data.title?.toLowerCase() || '';
    const aDescription = a.data.description?.toLowerCase() || '';
    const bDescription = b.data.description?.toLowerCase() || '';
    
    let aScore = 0;
    let bScore = 0;
    
    searchTerms.forEach(term => {
      if (aTitle.includes(term)) aScore += 3;
      if (bTitle.includes(term)) bScore += 3;
      
      if (aDescription.includes(term)) aScore += 2;
      if (bDescription.includes(term)) bScore += 2;
      
      if (a.data.tags && Array.isArray(a.data.tags) && a.data.tags.length > 0 && 
          a.data.tags.some((tag: string) => tag.toLowerCase().includes(term))) {
        aScore += 2;
      }
      
      if (b.data.tags && Array.isArray(b.data.tags) && b.data.tags.length > 0 && 
          b.data.tags.some((tag: string) => tag.toLowerCase().includes(term))) {
        bScore += 2;
      }
      
      if (a.body?.toLowerCase().includes(term)) aScore += 1;
      if (b.body?.toLowerCase().includes(term)) bScore += 1;
    });
    
    return bScore - aScore;
  });
};

/**
 * 获取相关文章
 * @param currentPost 当前文章
 * @param allPosts 所有文章
 * @param limit 相关文章数量限制
 * @returns 相关文章数组
 */
export const getRelatedPosts = (
  currentPost: any,
  allPosts: any[],
  limit: number = 3
): any[] => {
  const otherPosts = allPosts.filter(post => post.id !== currentPost.id);
  
  if (otherPosts.length === 0) {
    return [];
  }
  
  const currentTags = currentPost.data.tags || [];
  
  const postsWithScore = otherPosts.map(post => {
    const postTags = post.data.tags || [];
    const commonTags = postTags.filter((tag: string) => currentTags.includes(tag));
    
    return {
      post,
      score: commonTags.length,
    };
  });
  
  return postsWithScore
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      
      return new Date(b.post.data.pubDate).getTime() - new Date(a.post.data.pubDate).getTime();
    })
    .slice(0, limit)
    .map(item => item.post);
};

/**
 * 生成SEO元数据
 * @param post 文章对象
 * @param siteConfig 站点配置
 * @returns SEO元数据对象
 */
export const generateSEOMetadata = (
  post: any,
  siteConfig: any
): {
  title: string;
  description: string;
  canonical: string;
  openGraph: Record<string, any>;
  twitter: Record<string, any>;
} => {
  const title = post.data.title;
  const description = post.data.description || generateExcerpt(post.body || '', 160);
  const url = new URL(`/posts/${post.slug}`, siteConfig.siteUrl).toString();
  const publishedTime = new Date(post.data.pubDate).toISOString();
  const modifiedTime = post.data.updatedDate 
    ? new Date(post.data.updatedDate).toISOString() 
    : publishedTime;
  
  return {
    title: `${title} | ${siteConfig.siteName}`,
    description,
    canonical: url,
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      site_name: siteConfig.siteName,
      images: post.data.cover 
        ? [{ url: new URL(post.data.cover, siteConfig.siteUrl).toString() }] 
        : [],
      publishedTime,
      modifiedTime,
      tags: post.data.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle || '',
      title,
      description,
      image: post.data.cover 
        ? new URL(post.data.cover, siteConfig.siteUrl).toString() 
        : '',
    },
  };
};
