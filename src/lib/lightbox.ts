// 图片灯箱功能实现
// 提供博客站点的图片灯箱效果

import { useState, useEffect, useCallback } from 'react';

interface LightboxOptions {
  enableZoom?: boolean;
  zoomFactor?: number;
  enableSwipe?: boolean;
  enableKeyboard?: boolean;
  closeOnClickOutside?: boolean;
  animationDuration?: number;
}

/**
 * 图片灯箱钩子函数
 * @param options 灯箱配置选项
 * @returns 灯箱状态和方法
 */
export const useLightbox = (options: LightboxOptions = {}) => {
  // 默认选项
  const defaultOptions: LightboxOptions = {
    enableZoom: true,
    zoomFactor: 1.5,
    enableSwipe: true,
    enableKeyboard: true,
    closeOnClickOutside: true,
    animationDuration: 300,
  };
  
  // 合并选项
  const config = { ...defaultOptions, ...options };
  
  // 状态
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  
  // 打开灯箱
  const openLightbox = useCallback((src: string, index: number = 0, imageList: string[] = []) => {
    setCurrentImage(src);
    setCurrentIndex(index);
    setImages(imageList.length > 0 ? imageList : [src]);
    setIsZoomed(false);
    setIsOpen(true);
    document.body.style.overflow = 'hidden'; // 防止背景滚动
  }, []);
  
  // 关闭灯箱
  const closeLightbox = useCallback(() => {
    setIsOpen(false);
    setIsZoomed(false);
    document.body.style.overflow = ''; // 恢复背景滚动
  }, []);
  
  // 切换缩放
  const toggleZoom = useCallback(() => {
    if (config.enableZoom) {
      setIsZoomed(!isZoomed);
    }
  }, [isZoomed, config.enableZoom]);
  
  // 下一张图片
  const nextImage = useCallback(() => {
    if (images.length <= 1) return;
    
    setLoadingImage(true);
    setIsZoomed(false);
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    setCurrentImage(images[nextIndex]);
  }, [currentIndex, images]);
  
  // 上一张图片
  const prevImage = useCallback(() => {
    if (images.length <= 1) return;
    
    setLoadingImage(true);
    setIsZoomed(false);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    setCurrentImage(images[prevIndex]);
  }, [currentIndex, images]);
  
  // 键盘事件处理
  useEffect(() => {
    if (!isOpen || !config.enableKeyboard) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case ' ': // 空格键
          toggleZoom();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, config.enableKeyboard, closeLightbox, nextImage, prevImage, toggleZoom]);
  
  // 图片加载完成处理
  const handleImageLoad = useCallback(() => {
    setLoadingImage(false);
  }, []);
  
  // 自动查找页面中的所有图片
  const initLightboxForImages = useCallback(() => {
    if (typeof document === 'undefined') return;
    
    // 查找页面中所有图片
    const findImages = () => {
      const articleImages = document.querySelectorAll('.prose img, article img');
      const imageList: string[] = [];
      
      articleImages.forEach((img, index) => {
        const imgElement = img as HTMLImageElement;
        const src = imgElement.src;
        
        if (src) {
          imageList.push(src);
          
          // 添加点击事件
          imgElement.style.cursor = 'pointer';
          imgElement.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(src, index, imageList);
          });
          
          // 添加数据属性
          imgElement.setAttribute('data-lightbox', 'true');
          imgElement.setAttribute('data-lightbox-index', index.toString());
        }
      });
      
      return imageList;
    };
    
    // 初始化
    const imageList = findImages();
    setImages(imageList);
    
    // 监听DOM变化，处理动态加载的图片
    const observer = new MutationObserver(() => {
      const updatedImageList = findImages();
      setImages(updatedImageList);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    
    return () => observer.disconnect();
  }, [openLightbox]);
  
  return {
    isOpen,
    currentImage,
    currentIndex,
    images,
    isZoomed,
    loadingImage,
    openLightbox,
    closeLightbox,
    toggleZoom,
    nextImage,
    prevImage,
    handleImageLoad,
    initLightboxForImages,
    config,
  };
};

/**
 * 图片预加载函数
 * @param src 图片URL
 * @returns Promise
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};
