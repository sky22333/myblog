import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并多个class名称，并处理Tailwind类名冲突
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化日期函数
 * @param date 日期对象
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 截断文本函数
 * @param text 要截断的文本
 * @param length 截断长度
 * @returns 截断后的文本
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * 分页函数
 * @param items 要分页的项目数组
 * @param page 当前页码
 * @param perPage 每页项目数
 * @returns 分页后的项目数组
 */
export function paginate<T>(items: T[], page: number = 1, perPage: number = 10): T[] {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return items.slice(start, end);
}

/**
 * 计算阅读时间
 * @param content 文章内容
 * @param wordsPerMinute 每分钟阅读字数
 * @returns 阅读时间（分钟）
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes);
}

/**
 * 滚动到页面顶部工具函数
 * @param smooth 是否使用平滑滚动，默认为true
 */
export function scrollToTop(smooth: boolean = true): void {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto',
  });
}
