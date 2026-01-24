// 内容集合配置文件
import { defineCollection, z } from 'astro:content';

// 文章集合的模式定义
const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // 文章标题
    title: z.string(),
    // 文章描述
    description: z.string(),
    // 发布日期
    pubDate: z.date(),
    // 更新日期（可选）
    updatedDate: z.date().optional(),
    // 封面图片（可选）
    cover: z.string().optional(),
    // 作者ID
    author: z.string(),
    // 标签列表
    tags: z.array(z.string()).default([]),
    // 是否置顶
    featured: z.boolean().default(false),
    // 阅读时间（分钟）
    readingTime: z.number().optional(),
    // 草稿状态
    draft: z.boolean().default(false),
    // SEO相关
    seo: z.object({
      // SEO标题（可选，默认使用文章标题）
      title: z.string().optional(),
      // SEO描述（可选，默认使用文章描述）
      description: z.string().optional(),
      // 关键词
      keywords: z.array(z.string()).optional(),
    }).optional(),
  }),
});

// 作者集合的模式定义
const authorsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    // 作者名称
    name: z.string(),
    // 作者简介
    bio: z.string(),
    // 作者头像
    avatar: z.string().optional(),
    // 社交媒体链接
    socials: z.object({
      github: z.string().optional(),
      twitter: z.string().optional(),
      bilibili: z.string().optional(),
      weibo: z.string().optional(),
      youtube: z.string().optional(),
      email: z.string().optional(),
    }).optional(),
  }),
});

// 站点配置集合
const configCollection = defineCollection({
  type: 'data',
  schema: z.object({
    // 站点名称
    siteName: z.string(),
    // 站点描述
    siteDescription: z.string(),
    // 站点URL
    siteUrl: z.string().url(),
    // 站点语言
    language: z.string().default('zh-CN'),
    // 站点Logo
    logo: z.string().optional(),
    // 站点图标
    favicon: z.string().optional(),
    // 社交媒体链接
    socials: z.object({
      github: z.string().optional(),
      twitter: z.string().optional(),
      bilibili: z.string().optional(),
      weibo: z.string().optional(),
      youtube: z.string().optional(),
      email: z.string().optional(),
    }).optional(),
    // 导航菜单
    navItems: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
      })
    ).optional(),
    // 每页显示的文章数量
    postsPerPage: z.number().default(12),
    // 友情链接
    friendLinks: z.array(
      z.object({
        name: z.string(),
        url: z.string().url(),
        description: z.string().optional(),
        avatar: z.string().optional(),
      })
    ).optional(),
  }),
});

// 导出集合配置
export const collections = {
  'posts': postsCollection,
  'authors': authorsCollection,
  'config': configCollection,
};
