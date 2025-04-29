// SEO优化工具
// 提供博客站点的SEO优化功能

/**
 * 生成页面元数据
 * @param options 元数据选项
 * @returns 元数据对象
 */
export const generateMetadata = (options: {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  siteName: string;
  locale?: string;
  twitterHandle?: string;
}) => {
  const {
    title,
    description,
    url,
    image,
    type = 'website',
    publishedTime,
    modifiedTime,
    tags = [],
    siteName,
    locale = 'zh_CN',
    twitterHandle,
  } = options;

  // 基础元数据
  const metadata = {
    title,
    description,
    canonical: url,
  };

  // Open Graph 元数据
  const openGraph = {
    title,
    description,
    url,
    type,
    locale,
    siteName,
  };

  // 如果有图片，添加图片元数据
  if (image) {
    Object.assign(openGraph, {
      images: [
        {
          url: image,
          alt: title,
        },
      ],
    });
  }

  // 如果是文章类型，添加文章特定元数据
  if (type === 'article') {
    Object.assign(openGraph, {
      publishedTime,
      modifiedTime,
      tags,
    });
  }

  // Twitter 元数据
  const twitter = {
    card: image ? 'summary_large_image' : 'summary',
    title,
    description,
    site: twitterHandle,
  };

  // 如果有图片，添加图片元数据
  if (image) {
    Object.assign(twitter, {
      image,
      imageAlt: title,
    });
  }

  return {
    ...metadata,
    openGraph,
    twitter,
  };
};

/**
 * 生成结构化数据
 * @param type 数据类型
 * @param data 数据内容
 * @returns 结构化数据对象
 */
export const generateStructuredData = (
  type: 'BlogPosting' | 'WebSite' | 'BreadcrumbList' | 'Person',
  data: Record<string, any>
) => {
  // 基础结构
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return structuredData;
};

/**
 * 生成博客文章的结构化数据
 * @param post 文章数据
 * @param siteConfig 站点配置
 * @returns 结构化数据对象
 */
export const generateBlogPostStructuredData = (post: any, siteConfig: any) => {
  const { siteName, siteUrl, authorName, authorUrl } = siteConfig;
  const {
    title,
    description,
    pubDate,
    updatedDate,
    cover,
    slug,
  } = post.data;

  const url = `${siteUrl}/posts/${slug}`;
  const imageUrl = cover ? (cover.startsWith('http') ? cover : `${siteUrl}${cover}`) : '';

  return generateStructuredData('BlogPosting', {
    headline: title,
    description: description,
    image: imageUrl,
    datePublished: new Date(pubDate).toISOString(),
    dateModified: updatedDate ? new Date(updatedDate).toISOString() : new Date(pubDate).toISOString(),
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}${siteConfig.logo || '/favicon.ico'}`,
        width: '60',
        height: '60'
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  });
};

/**
 * 生成网站的结构化数据
 * @param siteConfig 站点配置
 * @returns 结构化数据对象
 */
export const generateWebSiteStructuredData = (siteConfig: any) => {
  const { siteName, siteDescription, siteUrl, authorName } = siteConfig;

  return generateStructuredData('WebSite', {
    name: siteName,
    description: siteDescription,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    author: {
      '@type': 'Person',
      name: authorName,
    },
  });
};

/**
 * 生成面包屑导航的结构化数据
 * @param items 导航项目数组
 * @param siteUrl 站点URL
 * @returns 结构化数据对象
 */
export const generateBreadcrumbStructuredData = (
  items: Array<{ name: string; url: string }>,
  siteUrl: string
) => {
  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${siteUrl}${item.url}`,
  }));

  return generateStructuredData('BreadcrumbList', {
    itemListElement,
  });
};

/**
 * 生成作者的结构化数据
 * @param author 作者数据
 * @param siteUrl 站点URL
 * @returns 结构化数据对象
 */
export const generatePersonStructuredData = (
  author: {
    name: string;
    description?: string;
    image?: string;
    url?: string;
    sameAs?: string[];
  },
  siteUrl: string
) => {
  const { name, description, image, url, sameAs = [] } = author;

  return generateStructuredData('Person', {
    name,
    description,
    image: image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : undefined,
    url: url ? (url.startsWith('http') ? url : `${siteUrl}${url}`) : `${siteUrl}/about`,
    sameAs,
  });
};

/**
 * 生成JSON-LD脚本标签内容
 * @param data 结构化数据对象
 * @returns JSON-LD脚本标签内容
 */
export const generateJSONLD = (data: Record<string, any>) => {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
};

/**
 * 生成规范链接标签
 * @param url 规范URL
 * @returns 规范链接标签
 */
export const generateCanonicalLink = (url: string) => {
  return `<link rel="canonical" href="${url}" />`;
};

/**
 * 生成替代语言链接标签
 * @param url 当前URL
 * @param alternates 替代语言配置
 * @returns 替代语言链接标签数组
 */
export const generateAlternateLinks = (
  url: string,
  alternates: Record<string, string>
) => {
  return Object.entries(alternates).map(
    ([lang, path]) => `<link rel="alternate" hreflang="${lang}" href="${url}${path}" />`
  );
};
