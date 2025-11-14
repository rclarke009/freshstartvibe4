import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({context, request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const data = await context.storefront.query(PAGES_QUERY);
  const today = new Date().toISOString().split('T')[0];

  // Shopify pages
  const shopifyPages = data.pages.nodes
    .map(
      (p) => `  <url>
    <loc>${baseUrl}/pages/${p.handle}</loc>
    <lastmod>${p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : today}</lastmod>
  </url>`,
    )
    .join('\n');

  // Custom static routes
  const customRoutes = [
    {url: `${baseUrl}/`, priority: '1.0', changefreq: 'daily'},
    {url: `${baseUrl}/contact`, priority: '0.8', changefreq: 'monthly'},
    {url: `${baseUrl}/choose-your-purifier`, priority: '0.9', changefreq: 'monthly'},
    {url: `${baseUrl}/fragrance-sensitivity`, priority: '0.8', changefreq: 'monthly'},
  ];

  const customPages = customRoutes
    .map(
      (route) => `  <url>
    <loc>${route.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${shopifyPages}
${customPages}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': `max-age=${60 * 60 * 24}`,
    },
  });
}

const PAGES_QUERY = `#graphql
  query {
    pages(first: 250, sortKey: UPDATED_AT) {
      nodes {
        handle
        updatedAt
      }
    }
  }
` as const;

