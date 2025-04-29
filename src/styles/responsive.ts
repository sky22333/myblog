// 响应式设计工具函数
// 提供响应式布局和媒体查询的工具函数

// 断点配置
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

/**
 * 创建媒体查询
 * @param breakpoint 断点名称或自定义宽度
 * @param type 查询类型，min表示大于等于，max表示小于等于
 * @returns 媒体查询字符串
 */
export const createMediaQuery = (
  breakpoint: keyof typeof breakpoints | number,
  type: "min" | "max" = "min"
) => {
  const width = typeof breakpoint === "number" ? breakpoint : breakpoints[breakpoint];
  return `@media (${type}-width: ${width}px)`;
};

/**
 * 响应式样式生成器
 * @param styles 基础样式对象
 * @param responsiveStyles 响应式样式对象
 * @returns 合并后的样式对象
 * 
 * 示例:
 * ```
 * const styles = responsive(
 *   { fontSize: '16px' }, // 基础样式
 *   {
 *     sm: { fontSize: '14px' }, // 小屏幕样式
 *     lg: { fontSize: '18px' }  // 大屏幕样式
 *   }
 * );
 * ```
 */
export const responsive = (
  styles: Record<string, any>,
  responsiveStyles: {
    sm?: Record<string, any>;
    md?: Record<string, any>;
    lg?: Record<string, any>;
    xl?: Record<string, any>;
    "2xl"?: Record<string, any>;
  }
) => {
  const result = { ...styles };

  Object.entries(responsiveStyles).forEach(([breakpoint, styles]) => {
    const mediaQuery = createMediaQuery(breakpoint as keyof typeof breakpoints);
    result[mediaQuery] = styles;
  });

  return result;
};

/**
 * 移动优先的响应式样式
 * 为小屏幕设备优先设计样式，然后为更大的屏幕添加样式
 * @param baseStyles 基础样式（移动设备）
 * @param smStyles 小屏幕样式 (≥640px)
 * @param mdStyles 中等屏幕样式 (≥768px)
 * @param lgStyles 大屏幕样式 (≥1024px)
 * @param xlStyles 超大屏幕样式 (≥1280px)
 * @param xxlStyles 超超大屏幕样式 (≥1536px)
 * @returns 合并后的样式对象
 */
export const mobileFirst = (
  baseStyles: Record<string, any>,
  smStyles?: Record<string, any>,
  mdStyles?: Record<string, any>,
  lgStyles?: Record<string, any>,
  xlStyles?: Record<string, any>,
  xxlStyles?: Record<string, any>
) => {
  const result = { ...baseStyles };

  if (smStyles) {
    result[createMediaQuery("sm")] = smStyles;
  }

  if (mdStyles) {
    result[createMediaQuery("md")] = mdStyles;
  }

  if (lgStyles) {
    result[createMediaQuery("lg")] = lgStyles;
  }

  if (xlStyles) {
    result[createMediaQuery("xl")] = xlStyles;
  }

  if (xxlStyles) {
    result[createMediaQuery("2xl")] = xxlStyles;
  }

  return result;
};

/**
 * 桌面优先的响应式样式
 * 为大屏幕设备优先设计样式，然后为更小的屏幕添加样式
 * @param baseStyles 基础样式（桌面设备）
 * @param xlStyles 超大屏幕以下样式 (<1280px)
 * @param lgStyles 大屏幕以下样式 (<1024px)
 * @param mdStyles 中等屏幕以下样式 (<768px)
 * @param smStyles 小屏幕以下样式 (<640px)
 * @returns 合并后的样式对象
 */
export const desktopFirst = (
  baseStyles: Record<string, any>,
  xlStyles?: Record<string, any>,
  lgStyles?: Record<string, any>,
  mdStyles?: Record<string, any>,
  smStyles?: Record<string, any>
) => {
  const result = { ...baseStyles };

  if (xlStyles) {
    result[createMediaQuery("xl", "max")] = xlStyles;
  }

  if (lgStyles) {
    result[createMediaQuery("lg", "max")] = lgStyles;
  }

  if (mdStyles) {
    result[createMediaQuery("md", "max")] = mdStyles;
  }

  if (smStyles) {
    result[createMediaQuery("sm", "max")] = smStyles;
  }

  return result;
};

/**
 * 创建特定设备的媒体查询
 * @returns 设备特定的媒体查询对象
 */
export const devices = {
  // 移动设备
  mobile: createMediaQuery(breakpoints.sm - 1, "max"),
  
  // 平板设备
  tablet: `@media (min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.lg - 1}px)`,
  
  // 桌面设备
  desktop: createMediaQuery("lg"),
  
  // 触摸设备
  touch: "@media (hover: none) and (pointer: coarse)",
  
  // 鼠标设备
  mouse: "@media (hover: hover) and (pointer: fine)",
  
  // 深色模式
  dark: "@media (prefers-color-scheme: dark)",
  
  // 浅色模式
  light: "@media (prefers-color-scheme: light)",
  
  // 减少动画
  reducedMotion: "@media (prefers-reduced-motion: reduce)",
};

/**
 * 创建网格布局样式
 * @param columns 列数或响应式列数对象
 * @param gap 间距
 * @returns 网格布局样式对象
 * 
 * 示例:
 * ```
 * const gridStyles = createGrid(
 *   { base: 1, sm: 2, md: 3, lg: 4 }, // 响应式列数
 *   '1rem' // 间距
 * );
 * ```
 */
export const createGrid = (
  columns: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number; "2xl"?: number },
  gap: string = "1rem"
) => {
  if (typeof columns === "number") {
    return {
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      gap,
    };
  }

  const { base = 1, ...responsiveColumns } = columns;
  
  const baseStyles = {
    display: "grid",
    gridTemplateColumns: `repeat(${base}, minmax(0, 1fr))`,
    gap,
  };

  const responsiveStyles = Object.entries(responsiveColumns).reduce(
    (acc, [breakpoint, cols]) => {
      acc[breakpoint as keyof typeof responsiveColumns] = {
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      };
      return acc;
    },
    {} as Record<string, any>
  );

  return responsive(baseStyles, responsiveStyles);
};
