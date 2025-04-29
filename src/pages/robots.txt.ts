// 自定义robots.txt文件
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  // 基本站点URL
  const site = import.meta.env.SITE || 'https://www.52013120.xyz';

  // 生成robots.txt内容
  const robotsTxt = `User-agent: *
Allow: /

# 站点地图链接
Sitemap: ${site}/sitemap.xml
Sitemap: ${site}/sitemap-index.xml
Sitemap: ${site}/sitemap-additional.xml

# 禁止访问部分内容
Disallow: /api/
Disallow: /admin/
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'max-age=3600',
    },
  });
}; 