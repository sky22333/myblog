// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import pagefind from 'astro-pagefind';

// 导入remark和rehype插件
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.52013120.xyz', // 修复域名配置（去掉多余的w）
  
  // 集成插件
  integrations: [
    // React集成
    react(),
    
    // MDX集成，支持Markdown扩展
    mdx({
      // MDX选项
      remarkPlugins: [
        // 自动生成目录
        [remarkToc, { tight: true }],
      ],
      rehypePlugins: [
        // 为标题添加ID
        rehypeSlug,
        // 为标题添加锚点链接
        [rehypeAutolinkHeadings, { behavior: 'append' }],
      ],
      // 启用GFM (GitHub Flavored Markdown)
      gfm: true,
    }),
    tailwind({
      config: { path: './tailwind.config.mjs' },
      applyBaseStyles: false,
    }),
    // 站点地图生成
    sitemap({
      filter: (page) => !page.includes('/_'), // 过滤掉内部页面
      changefreq: 'weekly',
      lastmod: new Date(),
      serialize(item) {
        // 自定义优先级 - 首页和文章列表页优先级高
        if (item.url === 'https://www.52013120.xyz/') {
          return {
            ...item,
            priority: 1.0,
          };
        }
        if (item.url.includes('/posts/') && !item.url.endsWith('/posts/')) {
          return {
            ...item,
            priority: 0.8, // 文章页优先级
            changefreq: 'monthly',
          };
        }
        if (item.url.endsWith('/posts/') || 
            item.url.includes('/tags/') || 
            item.url.includes('/about/') || 
            item.url.includes('/archives/')) {
          return {
            ...item,
            priority: 0.7, // 重要分类页优先级
          };
        }
        return {
          ...item,
          priority: 0.5, // 其他页面默认优先级
        };
      },
    }),
    
    // robots.txt生成
    robotsTxt({
      policy: [
        {
          userAgent: '*',
          allow: '/',
        },
      ],
      sitemap: true,
      sitemapBaseFileName: 'sitemap-index', // 确保使用正确的站点地图文件名
    }),
    
    // Pagefind搜索集成 - 将在构建时生成搜索索引
    pagefind({
      exclude: [
        // 排除一些不需要搜索的页面
        "/_*", // 排除以_开头的路径
        "**/admin/**", // 排除admin路径
        "/api/*" // 排除API路径
      ],
      excludeSelectors: [
        // 排除这些元素中的内容不被索引
        "nav", 
        "header nav", 
        "footer",
        "#mobile-nav-menu",
        ".pagefind-ignore",
        ".exclude-from-search"
      ],
      // 确保正确索引所有内容
      performanceTest: {
        enabled: true,
        timeAllowance: 30000 // 给索引足够的时间
      },
      // 中文分词优化
      customLanguages: [
        {
          language: "zh-cn",
          searchWithDiacritics: false, // 中文不需要音调符号搜索
          splittingStrategy: "forward", // 向前分词策略：对中文更友好
          customSegmenter: (text) => {
            // 基础的中文分词 - 按每个字符拆分
            const segments = [];
            // 遍历文本，创建各种可能的词组
            for (let i = 0; i < text.length; i++) {
              // 单字符
              segments.push(text.substring(i, i + 1));
              
              // 最多添加3字符长度的词组，防止组合爆炸
              for (let j = 1; j <= 3 && i + j < text.length; j++) {
                segments.push(text.substring(i, i + j + 1));
              }
            }
            return segments;
          }
        }
      ],
      // 自定义过滤器和排序，提升搜索质量
      filterOutput: (indexData) => {
        for (const entry of indexData.data) {
          // 修正标题、内容和URL
          if (entry.filters?.length) {
            entry.filters = entry.filters.map(filter => {
              // 确保标签名称是人类可读的
              if (filter.key === "tags") {
                return { 
                  ...filter,
                  // 标签格式化为首字母大写
                  value: filter.value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                };
              }
              return filter;
            });
          }
        }
        return indexData;
      }
    }),
  ],
  
  // Vite配置
  vite: {
    plugins: [],
    // 优化构建
    build: {
      // 启用CSS代码分割
      cssCodeSplit: true,
      // 启用CSS最小化
      cssMinify: true,
      // 启用JS最小化
      minify: 'terser',
      // Terser选项
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
    // 优化开发体验
    server: {
      hmr: true,
    },
    // 优化图片处理
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  },
  
  // 输出选项
  output: 'static',
  
  // 构建选项
  build: {
    // 启用视图过渡动画
    viewTransition: true,
    assets: 'assets',
  },
  
  // 图像优化
  image: {
    // 启用图像优化
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
