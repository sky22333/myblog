// RSS和站点地图生成工具
// 提供博客站点的RSS订阅和站点地图生成功能

/**
 * 生成RSS订阅内容
 * @param posts 文章数组
 * @param siteConfig 站点配置
 * @returns RSS XML字符串
 */
export const generateRSS = (posts: any[], siteConfig: any): string => {
  const { siteName, siteDescription, siteUrl, language = 'zh-CN' } = siteConfig;
  const lastBuildDate = new Date().toUTCString();
  
  // RSS头部
  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <description>${escapeXml(siteDescription)}</description>
    <link>${siteUrl}</link>
    <language>${language}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
`;
  
  // 添加文章
  posts.forEach(post => {
    const pubDate = new Date(post.data.pubDate).toUTCString();
    const link = `${siteUrl}/posts/${post.slug}`;
    const description = post.data.description || '';
    
    rss += `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <description>${escapeXml(description)}</description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
`;
    
    // 添加文章标签
    if (post.data.tags && post.data.tags.length > 0) {
      post.data.tags.forEach((tag: string) => {
        rss += `      <category>${escapeXml(tag)}</category>\n`;
      });
    }
    
    rss += `    </item>\n`;
  });
  
  // RSS尾部
  rss += `  </channel>
</rss>`;
  
  return rss;
};

/**
 * 生成Atom订阅内容
 * @param posts 文章数组
 * @param siteConfig 站点配置
 * @returns Atom XML字符串
 */
export const generateAtom = (posts: any[], siteConfig: any): string => {
  const { siteName, siteDescription, siteUrl, authorName, authorEmail } = siteConfig;
  const updated = new Date().toISOString();
  
  // Atom头部
  let atom = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(siteName)}</title>
  <subtitle>${escapeXml(siteDescription)}</subtitle>
  <link href="${siteUrl}/atom.xml" rel="self" type="application/atom+xml" />
  <link href="${siteUrl}" rel="alternate" type="text/html" />
  <updated>${updated}</updated>
  <id>${siteUrl}/</id>
  <author>
    <name>${escapeXml(authorName || siteName)}</name>
    ${authorEmail ? `<email>${escapeXml(authorEmail)}</email>` : ''}
  </author>
`;
  
  // 添加文章
  posts.forEach(post => {
    const updated = post.data.updatedDate 
      ? new Date(post.data.updatedDate).toISOString()
      : new Date(post.data.pubDate).toISOString();
    const published = new Date(post.data.pubDate).toISOString();
    const link = `${siteUrl}/posts/${post.slug}`;
    const description = post.data.description || '';
    
    atom += `  <entry>
    <title>${escapeXml(post.data.title)}</title>
    <link href="${link}" rel="alternate" type="text/html" title="${escapeXml(post.data.title)}" />
    <published>${published}</published>
    <updated>${updated}</updated>
    <id>${link}</id>
    <content type="html"><![CDATA[${description}]]></content>
`;
    
    // 添加文章标签
    if (post.data.tags && post.data.tags.length > 0) {
      post.data.tags.forEach((tag: string) => {
        atom += `    <category term="${escapeXml(tag)}" />\n`;
      });
    }
    
    atom += `  </entry>\n`;
  });
  
  // Atom尾部
  atom += `</feed>`;
  
  return atom;
};

/**
 * 生成站点地图内容
 * @param urls URL数组，每个元素包含url、lastmod、changefreq、priority
 * @param siteConfig 站点配置
 * @returns 站点地图XML字符串
 */
export const generateSitemap = (
  urls: Array<{
    url: string;
    lastmod?: string;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
  }>,
  siteConfig: any
): string => {
  const { siteUrl } = siteConfig;
  
  // 站点地图头部
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  
  // 添加URL
  urls.forEach(({ url, lastmod, changefreq, priority }) => {
    sitemap += `  <url>
    <loc>${siteUrl}${url.startsWith('/') ? url : `/${url}`}</loc>
`;
    
    if (lastmod) {
      sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
    }
    
    if (changefreq) {
      sitemap += `    <changefreq>${changefreq}</changefreq>\n`;
    }
    
    if (priority !== undefined) {
      sitemap += `    <priority>${priority.toFixed(1)}</priority>\n`;
    }
    
    sitemap += `  </url>\n`;
  });
  
  // 站点地图尾部
  sitemap += `</urlset>`;
  
  return sitemap;
};

/**
 * 生成robots.txt内容
 * @param siteConfig 站点配置
 * @param options 选项
 * @returns robots.txt内容
 */
export const generateRobots = (
  siteConfig: any,
  options: {
    disallow?: string[];
    allow?: string[];
    sitemap?: boolean;
  } = {}
): string => {
  const { siteUrl } = siteConfig;
  const { disallow = [], allow = [], sitemap = true } = options;
  
  let robots = `User-agent: *\n`;
  
  // 添加允许的路径
  allow.forEach(path => {
    robots += `Allow: ${path}\n`;
  });
  
  // 添加禁止的路径
  disallow.forEach(path => {
    robots += `Disallow: ${path}\n`;
  });
  
  // 添加站点地图
  if (sitemap) {
    robots += `\nSitemap: ${siteUrl}/sitemap.xml\n`;
  }
  
  return robots;
};

/**
 * 转义XML特殊字符
 * @param text 原始文本
 * @returns 转义后的文本
 */
const escapeXml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};
