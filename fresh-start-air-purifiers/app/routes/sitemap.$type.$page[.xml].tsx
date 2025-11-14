import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getSitemap} from '@shopify/hydrogen';

export async function loader({
  request,
  params,
  context: {storefront},
}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  
  // Handle custom static routes sitemap
  if (params.type === 'custom') {
    const customRoutes = [
      {url: `${baseUrl}/`, priority: '1.0', changefreq: 'daily'},
      {url: `${baseUrl}/contact`, priority: '0.8', changefreq: 'monthly'},
      {url: `${baseUrl}/choose-your-purifier`, priority: '0.9', changefreq: 'monthly'},
      {url: `${baseUrl}/fragrance-sensitivity`, priority: '0.8', changefreq: 'monthly'},
    ];
    
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${customRoutes
  .map(
    (route) => `  <url>
    <loc>${route.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

    return new Response(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': `max-age=${60 * 60 * 24}`,
      },
    });
  }
  
  // Standard Hydrogen sitemap for products, collections, pages, blogs
  const response = await getSitemap({
    storefront,
    request,
    params,
    locales: ['EN-US', 'EN-CA', 'FR-CA'],
    getLink: ({type, baseUrl, handle, locale}) => {
      if (!locale) return `${baseUrl}/${type}/${handle}`;
      return `${baseUrl}/${locale}/${type}/${handle}`;
    },
  });

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}
