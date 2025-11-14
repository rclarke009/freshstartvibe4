import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap_products_1.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap_pages_1.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap_collections_1.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap_blogs_1.xml</loc>
  </sitemap>
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': `max-age=${60 * 60 * 24}`,
    },
  });
}

