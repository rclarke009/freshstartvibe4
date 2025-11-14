import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getSitemapIndex} from '@shopify/hydrogen';

export async function loader({
  request,
  context: {storefront},
}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  
  // Get the standard sitemap index from Hydrogen
  const response = await getSitemapIndex({
    storefront,
    request,
  });
  
  // Add custom routes sitemap to the index
  const sitemapIndexText = await response.text();
  const sitemapIndexCloseIndex = sitemapIndexText.lastIndexOf('</sitemapindex>');
  
  if (sitemapIndexCloseIndex !== -1) {
    // Match Hydrogen's single-line formatting style
    const today = new Date().toISOString().split('T')[0];
    const customSitemapEntry = `\n  <sitemap><loc>${baseUrl}/sitemap/custom/1.xml</loc><lastmod>${today}</lastmod></sitemap>\n`;
    
    const updatedIndex = 
      sitemapIndexText.slice(0, sitemapIndexCloseIndex) + 
      customSitemapEntry + 
      sitemapIndexText.slice(sitemapIndexCloseIndex);
    
    return new Response(updatedIndex, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': `max-age=${60 * 60 * 24}`,
      },
    });
  }

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}
