// 排版工具函数
// 提供文本排版和样式的工具函数

import { fontConfig } from './theme';

/**
 * 标题样式生成器
 * @param level 标题级别 (1-6)
 * @param responsive 是否使用响应式字体大小
 * @returns 标题样式对象
 */
export const heading = (level: 1 | 2 | 3 | 4 | 5 | 6, responsive: boolean = true) => {
  // 基础字体大小（单位：rem）
  const baseSizes = {
    1: 2.5,    // h1: 2.5rem (40px)
    2: 2,      // h2: 2rem (32px)
    3: 1.5,    // h3: 1.5rem (24px)
    4: 1.25,   // h4: 1.25rem (20px)
    5: 1.125,  // h5: 1.125rem (18px)
    6: 1,      // h6: 1rem (16px)
  };
  
  // 移动端字体大小（单位：rem）
  const mobileSizes = {
    1: 2,      // h1: 2rem (32px)
    2: 1.75,   // h2: 1.75rem (28px)
    3: 1.375,  // h3: 1.375rem (22px)
    4: 1.125,  // h4: 1.125rem (18px)
    5: 1,      // h5: 1rem (16px)
    6: 0.875,  // h6: 0.875rem (14px)
  };
  
  // 行高
  const lineHeights = {
    1: 1.2,
    2: 1.25,
    3: 1.3,
    4: 1.4,
    5: 1.5,
    6: 1.5,
  };
  
  // 字体粗细
  const fontWeights = {
    1: 800,  // Extra Bold
    2: 700,  // Bold
    3: 700,  // Bold
    4: 600,  // Semi Bold
    5: 600,  // Semi Bold
    6: 500,  // Medium
  };
  
  // 字母间距
  const letterSpacings = {
    1: '-0.025em',
    2: '-0.025em',
    3: '-0.02em',
    4: '-0.015em',
    5: '-0.01em',
    6: '-0.01em',
  };
  
  // 基础样式
  const baseStyles = {
    fontFamily: fontConfig.sans,
    fontWeight: fontWeights[level],
    lineHeight: lineHeights[level],
    letterSpacing: letterSpacings[level],
    marginTop: level <= 2 ? '2rem' : '1.5rem',
    marginBottom: level <= 2 ? '1rem' : '0.75rem',
  };
  
  // 如果不需要响应式，直接返回固定字体大小
  if (!responsive) {
    return {
      ...baseStyles,
      fontSize: `${baseSizes[level]}rem`,
    };
  }
  
  // 响应式字体大小
  return {
    ...baseStyles,
    fontSize: `${mobileSizes[level]}rem`,
    '@media (min-width: 768px)': {
      fontSize: `${baseSizes[level]}rem`,
    },
  };
};

/**
 * 段落文本样式生成器
 * @param size 文本大小 ('xs', 'sm', 'base', 'lg', 'xl', '2xl')
 * @param responsive 是否使用响应式字体大小
 * @returns 段落样式对象
 */
export const paragraph = (
  size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' = 'base',
  responsive: boolean = true
) => {
  // 基础字体大小（单位：rem）
  const baseSizes = {
    'xs': 0.75,    // 12px
    'sm': 0.875,   // 14px
    'base': 1,     // 16px
    'lg': 1.125,   // 18px
    'xl': 1.25,    // 20px
    '2xl': 1.5,    // 24px
  };
  
  // 移动端字体大小（单位：rem）
  const mobileSizes = {
    'xs': 0.75,    // 12px
    'sm': 0.875,   // 14px
    'base': 1,     // 16px
    'lg': 1.125,   // 18px
    'xl': 1.125,   // 18px
    '2xl': 1.25,   // 20px
  };
  
  // 行高
  const lineHeights = {
    'xs': 1.5,
    'sm': 1.5,
    'base': 1.6,
    'lg': 1.6,
    'xl': 1.5,
    '2xl': 1.4,
  };
  
  // 基础样式
  const baseStyles = {
    fontFamily: fontConfig.sans,
    lineHeight: lineHeights[size],
    marginBottom: '1rem',
  };
  
  // 如果不需要响应式，直接返回固定字体大小
  if (!responsive) {
    return {
      ...baseStyles,
      fontSize: `${baseSizes[size]}rem`,
    };
  }
  
  // 响应式字体大小
  return {
    ...baseStyles,
    fontSize: `${mobileSizes[size]}rem`,
    '@media (min-width: 768px)': {
      fontSize: `${baseSizes[size]}rem`,
    },
  };
};

/**
 * 文本截断工具
 * @param lines 最大行数
 * @returns 文本截断样式对象
 */
export const truncate = (lines: number = 1) => {
  if (lines === 1) {
    return {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    };
  }
  
  return {
    display: '-webkit-box',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
  };
};

/**
 * 文本对齐工具
 * @param alignment 对齐方式
 * @returns 文本对齐样式对象
 */
export const textAlign = (alignment: 'left' | 'center' | 'right' | 'justify') => {
  return {
    textAlign: alignment,
  };
};

/**
 * 文本变换工具
 * @param transform 变换方式
 * @returns 文本变换样式对象
 */
export const textTransform = (
  transform: 'uppercase' | 'lowercase' | 'capitalize' | 'none'
) => {
  return {
    textTransform: transform,
  };
};

/**
 * 文本装饰工具
 * @param decoration 装饰方式
 * @returns 文本装饰样式对象
 */
export const textDecoration = (
  decoration: 'underline' | 'line-through' | 'none'
) => {
  return {
    textDecoration: decoration,
  };
};

/**
 * 文本阴影工具
 * @param intensity 阴影强度 ('sm', 'md', 'lg')
 * @param color 阴影颜色
 * @returns 文本阴影样式对象
 */
export const textShadow = (
  intensity: 'sm' | 'md' | 'lg' = 'md',
  color: string = 'rgba(0, 0, 0, 0.2)'
) => {
  const shadows = {
    'sm': `0 1px 2px ${color}`,
    'md': `0 2px 4px ${color}`,
    'lg': `0 4px 8px ${color}`,
  };
  
  return {
    textShadow: shadows[intensity],
  };
};

/**
 * 文本间距工具
 * @param letterSpacing 字母间距
 * @param wordSpacing 单词间距
 * @returns 文本间距样式对象
 */
export const textSpacing = (
  letterSpacing?: string,
  wordSpacing?: string
) => {
  const styles: Record<string, string> = {};
  
  if (letterSpacing) {
    styles.letterSpacing = letterSpacing;
  }
  
  if (wordSpacing) {
    styles.wordSpacing = wordSpacing;
  }
  
  return styles;
};

/**
 * 文本平衡工具（使文本在多行中更均匀）
 * @returns 文本平衡样式对象
 */
export const textBalance = () => {
  return {
    textWrap: 'balance',
  };
};

/**
 * 引用文本样式
 * @param borderColor 边框颜色
 * @returns 引用文本样式对象
 */
export const blockquote = (borderColor: string = 'hsl(var(--primary) / 0.3)') => {
  return {
    borderLeftWidth: '4px',
    borderLeftColor: borderColor,
    paddingLeft: '1rem',
    fontStyle: 'italic',
    margin: '1.5rem 0',
  };
};

/**
 * 代码文本样式
 * @param inline 是否为行内代码
 * @returns 代码文本样式对象
 */
export const code = (inline: boolean = true) => {
  if (inline) {
    return {
      fontFamily: fontConfig.mono,
      fontSize: '0.875em',
      backgroundColor: 'hsl(var(--muted))',
      padding: '0.2em 0.4em',
      borderRadius: '0.25rem',
    };
  }
  
  return {
    fontFamily: fontConfig.mono,
    fontSize: '0.875em',
    backgroundColor: 'hsl(var(--muted))',
    padding: '1rem',
    borderRadius: '0.5rem',
    overflow: 'auto',
    margin: '1.5rem 0',
  };
};
