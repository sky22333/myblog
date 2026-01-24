// 交互效果工具函数
// 提供各种交互效果和用户体验增强的工具函数

/**
 * 悬停效果样式生成器
 * @param effect 效果类型
 * @param options 效果选项
 * @returns 悬停效果样式对象
 */
export const hoverEffect = (
  effect: 'scale' | 'lift' | 'glow' | 'underline' | 'color' | 'background' | 'border',
  options: Record<string, any> = {}
): Record<string, any> => {
  // 默认过渡时间
  const duration = options.duration || 300;
  
  // 基础样式
  const baseStyle = {
    transition: `all ${duration}ms ease-in-out`,
  };
  
  // 各种效果的悬停样式
  const effectStyles: Record<string, any> = {
    // 缩放效果
    scale: {
      ...baseStyle,
      '&:hover': {
        transform: `scale(${options.scale || 1.05})`,
      },
    },
    
    // 上浮效果
    lift: {
      ...baseStyle,
      '&:hover': {
        transform: `translateY(-${options.distance || '4px'})`,
        boxShadow: options.shadow || '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
    
    // 发光效果
    glow: {
      ...baseStyle,
      '&:hover': {
        boxShadow: `0 0 ${options.size || '20px'} ${options.color || 'rgba(var(--primary), 0.5)'}`,
      },
    },
    
    // 下划线效果
    underline: {
      ...baseStyle,
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '0',
        height: `${options.height || '2px'}`,
        backgroundColor: options.color || 'hsl(var(--primary))',
        transition: `width ${duration}ms ease-in-out`,
      },
      '&:hover::after': {
        width: '100%',
      },
    },
    
    // 颜色变化效果
    color: {
      ...baseStyle,
      '&:hover': {
        color: options.color || 'hsl(var(--primary))',
      },
    },
    
    // 背景色变化效果
    background: {
      ...baseStyle,
      '&:hover': {
        backgroundColor: options.color || 'hsl(var(--primary))',
        color: options.textColor || 'hsl(var(--primary-foreground))',
      },
    },
    
    // 边框效果
    border: {
      ...baseStyle,
      borderWidth: options.width || '1px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      '&:hover': {
        borderColor: options.color || 'hsl(var(--primary))',
      },
    },
  };
  
  return effectStyles[effect] || effectStyles.scale;
};

/**
 * 焦点效果样式生成器
 * @param color 焦点颜色
 * @param width 焦点环宽度
 * @param offset 焦点环偏移
 * @returns 焦点效果样式对象
 */
export const focusEffect = (
  color: string = 'hsl(var(--ring))',
  width: string = '2px',
  offset: string = '2px'
): Record<string, any> => {
  return {
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 ${offset} white, 0 0 0 calc(${offset} + ${width}) ${color}`,
    },
  };
};

/**
 * 点击效果样式生成器
 * @param scale 点击时的缩放比例
 * @returns 点击效果样式对象
 */
export const clickEffect = (scale: number = 0.98): Record<string, any> => {
  return {
    '&:active': {
      transform: `scale(${scale})`,
    },
  };
};

/**
 * 禁用状态样式生成器
 * @param opacity 禁用时的不透明度
 * @returns 禁用状态样式对象
 */
export const disabledEffect = (opacity: number = 0.5): Record<string, any> => {
  return {
    '&:disabled': {
      opacity,
      pointerEvents: 'none',
      cursor: 'not-allowed',
    },
  };
};

/**
 * 加载状态样式生成器
 * @param showSpinner 是否显示加载动画
 * @returns 加载状态样式对象
 */
export const loadingEffect = (showSpinner: boolean = true): Record<string, any> => {
  if (!showSpinner) {
    return {
      '&[data-loading="true"]': {
        opacity: 0.7,
        pointerEvents: 'none',
      },
    };
  }
  
  return {
    '&[data-loading="true"]': {
      position: 'relative',
      opacity: 0.7,
      pointerEvents: 'none',
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '1em',
        height: '1em',
        marginTop: '-0.5em',
        marginLeft: '-0.5em',
        border: '2px solid currentColor',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 0.6s linear infinite',
      },
    },
    '@keyframes spin': {
      to: { transform: 'rotate(360deg)' },
    },
  };
};

/**
 * 滚动动画效果
 * @param type 动画类型
 * @param options 动画选项
 * @returns 滚动动画样式对象
 */
export const scrollAnimation = (
  type: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale',
  options: Record<string, any> = {}
): Record<string, any> => {
  const duration = options.duration || 800;
  const delay = options.delay || 0;
  const distance = options.distance || '50px';
  const threshold = options.threshold || 0.1;
  
  // 基础样式
  const baseStyle = {
    opacity: 0,
    transition: `all ${duration}ms ease-out ${delay}ms`,
    'data-scroll': 'true',
    'data-scroll-threshold': threshold,
  };
  
  // 各种动画类型的初始样式
  const typeStyles: Record<string, any> = {
    fade: {
      ...baseStyle,
    },
    'slide-up': {
      ...baseStyle,
      transform: `translateY(${distance})`,
    },
    'slide-down': {
      ...baseStyle,
      transform: `translateY(-${distance})`,
    },
    'slide-left': {
      ...baseStyle,
      transform: `translateX(${distance})`,
    },
    'slide-right': {
      ...baseStyle,
      transform: `translateX(-${distance})`,
    },
    scale: {
      ...baseStyle,
      transform: `scale(${options.scale || 0.95})`,
    },
  };
  
  // 可见时的样式
  const visibleStyle = {
    '&[data-scroll-visible="true"]': {
      opacity: 1,
      transform: 'translate(0) scale(1)',
    },
  };
  
  return {
    ...typeStyles[type],
    ...visibleStyle,
  };
};

/**
 * 波纹点击效果
 * @param color 波纹颜色
 * @param duration 动画持续时间
 * @returns 波纹点击效果样式对象
 */
export const rippleEffect = (
  color: string = 'rgba(255, 255, 255, 0.3)',
  duration: number = 600
): Record<string, any> => {
  return {
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      pointerEvents: 'none',
      backgroundImage: `radial-gradient(circle, ${color} 10%, transparent 10.01%)`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '50%',
      transform: 'scale(10, 10)',
      opacity: 0,
      transition: `transform ${duration}ms, opacity ${duration * 0.8}ms`,
    },
    '&:active::after': {
      transform: 'scale(0, 0)',
      opacity: 0.3,
      transition: '0s',
    },
  };
};

/**
 * 工具提示效果
 * @param content 提示内容
 * @param position 提示位置
 * @param options 提示选项
 * @returns 工具提示效果样式对象
 */
export const tooltipEffect = (
  content: string,
  position: 'top' | 'right' | 'bottom' | 'left' = 'top',
  options: Record<string, any> = {}
): Record<string, any> => {
  const delay = options.delay || 300;
  const offset = options.offset || '10px';
  const maxWidth = options.maxWidth || '200px';
  const color = options.color || 'hsl(var(--popover-foreground))';
  const bgColor = options.bgColor || 'hsl(var(--popover))';
  const borderColor = options.borderColor || 'hsl(var(--border))';
  
  // 位置样式
  const positionStyles: Record<string, any> = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginBottom: offset,
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginLeft: offset,
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginTop: offset,
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginRight: offset,
    },
  };
  
  // 箭头样式
  const arrowStyles: Record<string, any> = {
    top: {
      bottom: '-5px',
      left: '50%',
      marginLeft: '-5px',
      borderWidth: '5px 5px 0',
      borderTopColor: bgColor,
    },
    right: {
      left: '-5px',
      top: '50%',
      marginTop: '-5px',
      borderWidth: '5px 5px 5px 0',
      borderRightColor: bgColor,
    },
    bottom: {
      top: '-5px',
      left: '50%',
      marginLeft: '-5px',
      borderWidth: '0 5px 5px',
      borderBottomColor: bgColor,
    },
    left: {
      right: '-5px',
      top: '50%',
      marginTop: '-5px',
      borderWidth: '5px 0 5px 5px',
      borderLeftColor: bgColor,
    },
  };
  
  return {
    position: 'relative',
    '&::before': {
      // 提示内容
      content: `"${content}"`,
      position: 'absolute',
      ...positionStyles[position],
      zIndex: 10,
      padding: '0.5rem 0.75rem',
      borderRadius: '0.25rem',
      fontSize: '0.875rem',
      fontWeight: 'normal',
      lineHeight: 1.4,
      textAlign: 'center',
      color,
      backgroundColor: bgColor,
      border: `1px solid ${borderColor}`,
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      whiteSpace: 'nowrap',
      maxWidth,
      pointerEvents: 'none',
      opacity: 0,
      visibility: 'hidden',
      transition: `opacity 150ms ease-in-out, visibility 150ms ease-in-out`,
      transitionDelay: '0ms',
    },
    '&::after': {
      // 提示箭头
      content: '""',
      position: 'absolute',
      ...arrowStyles[position],
      zIndex: 11,
      borderStyle: 'solid',
      borderColor: 'transparent',
      pointerEvents: 'none',
      opacity: 0,
      visibility: 'hidden',
      transition: `opacity 150ms ease-in-out, visibility 150ms ease-in-out`,
      transitionDelay: '0ms',
    },
    '&:hover::before, &:hover::after': {
      opacity: 1,
      visibility: 'visible',
      transitionDelay: `${delay}ms`,
    },
  };
};
