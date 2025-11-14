import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {sanityClient} from '~/lib/sanityClient';

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  // Fetch all published blog posts from Sanity
  const blogs = await sanityClient.fetch(`
    *[_type == "blog" && defined(slug.current)] | order(publishedAt desc) {
      "slug": slug.current,
      "updatedAt": _updatedAt,
      "publishedAt": publishedAt
    }
  `);

  // Generate URL entries for each blog post
  const urls = blogs
    .map((blog) => {
      // Use publishedAt if available, otherwise use _updatedAt, otherwise today
      const lastmod = blog.publishedAt 
        ? new Date(blog.publishedAt).toISOString().split('T')[0]
        : blog.updatedAt
        ? new Date(blog.updatedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      return `  <url>
    <loc>${baseUrl}/blogs/${blog.slug}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
    })
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

