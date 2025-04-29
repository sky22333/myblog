// 自定义站点地图生成
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// 生成扁平化的站点地图
export const GET: APIRoute = async () => {
  const posts = await getCollection('posts', ({ data }) => {
    return !data.draft; // 只包含非草稿文章
  });

  // 基本站点URL
  const site = import.meta.env.SITE || 'https://www.52013120.xyz';
  
  // 获取当前日期为最后修改日期
  const lastMod = new Date().toISOString().split('T')[0];

  // 生成站点地图XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 首页 -->
  <url>
    <loc>${site}/</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- 文章列表页 -->
  <url>
    <loc>${site}/posts/</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- 关于页 -->
  <url>
    <loc>${site}/about/</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- 友链页 -->
  <url>
    <loc>${site}/friends/</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- 归档页 -->
  <url>
    <loc>${site}/archives/</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- 文章详情页 -->
  ${posts.map(post => {
    // 获取文章最后修改日期或发布日期
    const postLastmod = post.data.updatedDate 
      ? post.data.updatedDate.toISOString().split('T')[0]
      : post.data.pubDate.toISOString().split('T')[0];
      
    return `<url>
    <loc>${site}/posts/${post.slug}/</loc>
    <lastmod>${postLastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('\n  ')}
  
  <!-- 标签页 -->
  ${Array.from(new Set(posts.flatMap(post => post.data.tags))).map(tag => `
  <url>
    <loc>${site}/tags/${tag}/</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n  ')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600',
    },
  });
}; 
