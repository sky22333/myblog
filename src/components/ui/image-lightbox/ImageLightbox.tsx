import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useLightbox, preloadImage } from '@/lib/lightbox';

interface ImageLightboxProps {
  children?: React.ReactNode;
  className?: string;
  enableZoom?: boolean;
  zoomFactor?: number;
  enableSwipe?: boolean;
  enableKeyboard?: boolean;
  closeOnClickOutside?: boolean;
  animationDuration?: number;
}

/**
 * 图片灯箱组件
 * 提供图片预览、缩放、切换等功能
 */
const ImageLightbox: React.FC<ImageLightboxProps> = ({
  className,
  enableZoom = true,
  zoomFactor = 1.5,
  enableSwipe = true,
  enableKeyboard = true,
  closeOnClickOutside = true,
  animationDuration = 300,
}) => {
  // 使用lightbox钩子
  const lightbox = useLightbox({
    enableZoom,
    zoomFactor,
    enableSwipe,
    enableKeyboard,
    closeOnClickOutside,
    animationDuration
  });
  
  // 初始化灯箱
  useEffect(() => {
    lightbox.initLightboxForImages();
  }, []);
  
  // 如果灯箱未打开，不渲染内容
  if (!lightbox.isOpen) return null;
  
  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm',
        className
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget && closeOnClickOutside) {
          lightbox.closeLightbox();
        }
      }}
      onTouchStart={enableSwipe ? (e) => {
        // 触摸开始位置
        const touch = e.touches[0];
        const startX = touch.clientX;
        const startY = touch.clientY;
        
        // 保存开始位置
        const handleTouchMove = (e: TouchEvent) => {
          const touch = e.touches[0];
          const moveX = touch.clientX;
          const moveY = touch.clientY;
          
          // 移动距离
          const deltaX = startX - moveX;
          const deltaY = startY - moveY;
          
          // 如果水平滑动距离大于垂直滑动距离且大于50像素
          if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
              // 向左滑动，显示下一张
              lightbox.nextImage();
            } else {
              // 向右滑动，显示上一张
              lightbox.prevImage();
            }
            
            // 移除事件监听
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
          }
        };
        
        // 触摸结束
        const handleTouchEnd = () => {
          document.removeEventListener('touchmove', handleTouchMove);
          document.removeEventListener('touchend', handleTouchEnd);
        };
        
        // 添加触摸事件监听
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });
      } : undefined}
      style={{
        animation: `fadeIn ${animationDuration}ms ease-in-out`,
      }}
    >
      {/* 关闭按钮 */}
      <button
        className="absolute top-4 right-4 z-10 p-2 text-white bg-black/50 rounded-full hover:bg-black/70 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          lightbox.closeLightbox();
        }}
        aria-label="关闭"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      {/* 左侧导航箭头 (仅在有多张图片时显示) */}
      {lightbox.images.length > 1 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            lightbox.prevImage();
          }}
          aria-label="上一张"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      )}
      
      {/* 右侧导航箭头 (仅在有多张图片时显示) */}
      {lightbox.images.length > 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            lightbox.nextImage();
          }}
          aria-label="下一张"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      )}
      
      {/* 图片容器 */}
      <div
        className={cn(
          'relative max-h-[90vh] max-w-[90vw] select-none',
          lightbox.isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
        )}
        onClick={(e) => {
          e.stopPropagation();
          if (enableZoom) {
            lightbox.toggleZoom();
          }
        }}
      >
        {/* 加载指示器 */}
        {lightbox.loadingImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-white"></div>
          </div>
        )}
        
        {/* 图片 */}
        {lightbox.currentImage && (
          <img
            src={lightbox.currentImage}
            alt="灯箱图片"
            className={cn(
              'max-h-[90vh] max-w-[90vw] object-contain transition-transform duration-300',
              lightbox.isZoomed ? 'scale-[1.5]' : 'scale-100'
            )}
            onLoad={async () => {
              // 图片加载完成
              lightbox.handleImageLoad();
              
              // 预加载下一张图片
              if (lightbox.images.length > 1) {
                const nextIndex = (lightbox.currentIndex + 1) % lightbox.images.length;
                await preloadImage(lightbox.images[nextIndex]);
              }
            }}
          />
        )}
        
        {/* 图片计数器 (仅在有多张图片时显示) */}
        {lightbox.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 text-sm bg-black/50 text-white rounded-full">
            {lightbox.currentIndex + 1} / {lightbox.images.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageLightbox;
