import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({context, request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const data = await context.storefront.query(BLOGS_QUERY);

  const urls = data.articles.nodes
    .map(
      (a) => `  <url>
    <loc>${baseUrl}/blogs/${a.blog.handle}/${a.handle}</loc>
    <lastmod>${a.updatedAt ? new Date(a.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': `max-age=${60 * 60 * 24}`,
    },
  });
}

const BLOGS_QUERY = `#graphql
  query {
    articles(first: 250, sortKey: UPDATED_AT) {
      nodes {
        handle
        updatedAt
        blog {
          handle
        }
      }
    }
  }
` as const;

