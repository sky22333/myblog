import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface BackToTopProps {
  threshold?: number;
  smooth?: boolean;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  offset?: number;
  icon?: React.ReactNode;
  showLabel?: boolean;
  label?: string;
}

/**
 * 回到顶部组件
 * 当页面滚动超过指定阈值时显示，点击后平滑滚动回页面顶部
 */
const BackToTop: React.FC<BackToTopProps> = ({
  threshold = 300,
  smooth = true,
  className,
  position = 'bottom-right',
  offset = 20,
  icon,
  showLabel = false,
  label = '回到顶部',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // 监听滚动事件，控制按钮显示/隐藏
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    // 初始检查
    toggleVisibility();
    
    // 添加滚动事件监听
    window.addEventListener('scroll', toggleVisibility);
    
    // 清理函数
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);
  
  // 滚动回顶部
  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo(0, 0);
    }
  };
  
  // 根据位置设置样式
  const getPositionStyles = () => {
    const styles: React.CSSProperties = {
      position: 'fixed',
      zIndex: 40,
      bottom: `${offset}px`,
    };
    
    switch (position) {
      case 'bottom-left':
        styles.left = `${offset}px`;
        break;
      case 'bottom-center':
        styles.left = '50%';
        styles.transform = 'translateX(-50%)';
        break;
      case 'bottom-right':
      default:
        styles.right = `${offset}px`;
        break;
    }
    
    return styles;
  };
  
  // 默认图标
  const defaultIcon = (
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="16 12 12 8 8 12" />
      <line x1="12" y1="16" x2="12" y2="8" />
    </svg>
  );
  
  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={cn(
            "flex items-center justify-center p-3 rounded-full bg-background border border-border shadow-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all",
            showLabel ? "px-4" : "aspect-square",
            className
          )}
          style={getPositionStyles()}
          aria-label="回到顶部"
          title="回到顶部"
        >
          {icon || defaultIcon}
          {showLabel && <span className="ml-2">{label}</span>}
        </button>
      )}
    </>
  );
};

export default BackToTop;
