import React from 'react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = ({ currentPage, totalPages, onPageChange, className }: PaginationProps) => {
  // 生成页码数组
  const generatePagination = () => {
    // 如果总页数小于等于7，显示所有页码
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // 否则，显示当前页附近的页码和首尾页码
    const pages = [];
    
    // 始终显示第一页
    pages.push(1);
    
    // 当前页靠近开始
    if (currentPage <= 3) {
      pages.push(2, 3, 4, '...', totalPages);
    } 
    // 当前页靠近结束
    else if (currentPage >= totalPages - 2) {
      pages.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } 
    // 当前页在中间
    else {
      pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    
    return pages;
  };
  
  const pages = generatePagination();
  
  return (
    <nav className={cn("flex justify-center my-8", className)} aria-label="分页导航">
      <ul className="flex items-center space-x-1">
        {/* 上一页按钮 */}
        <li>
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(
              "flex items-center justify-center h-10 w-10 rounded-md",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              currentPage === 1 
                ? "text-muted-foreground cursor-not-allowed" 
                : "text-foreground hover:bg-muted"
            )}
            aria-label="上一页"
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
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        </li>
        
        {/* 页码按钮 */}
        {pages.map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span className="flex items-center justify-center h-10 px-4 text-muted-foreground">
                ...
              </span>
            ) : (
              <button
                onClick={() => typeof page === 'number' && onPageChange(page)}
                className={cn(
                  "flex items-center justify-center h-10 w-10 rounded-md",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  currentPage === page
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-foreground hover:bg-muted"
                )}
                aria-current={currentPage === page ? "page" : undefined}
                aria-label={`第 ${page} 页`}
              >
                {page}
              </button>
            )}
          </li>
        ))}
        
        {/* 下一页按钮 */}
        <li>
          <button
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(
              "flex items-center justify-center h-10 w-10 rounded-md",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              currentPage === totalPages 
                ? "text-muted-foreground cursor-not-allowed" 
                : "text-foreground hover:bg-muted"
            )}
            aria-label="下一页"
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
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
