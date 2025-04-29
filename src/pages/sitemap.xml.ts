// 主站点地图索引文件
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  // 基本站点URL
  const site = import.meta.env.SITE || 'https://www.52013120.xyz';
  
  // 获取当前日期
  const today = new Date().toISOString().split('T')[0];

  // 生成站点地图索引
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${site}/sitemap-index.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${site}/sitemap-additional.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600',
    },
  });
}; 