import type {EntryContext, AppLoadContext} from '@shopify/remix-oxygen';
import {RemixServer} from '@remix-run/react';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} nonce={nonce} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  
  // Modify the CSP header to include Sanity CDN permissions
  let modifiedCSP = header;
  
  // Add or update img-src directive
  if (modifiedCSP.includes('img-src')) {
    modifiedCSP = modifiedCSP.replace(
      /img-src[^;]*/g,
      "img-src 'self' https://cdn.shopify.com https://cdn.sanity.io data:"
    );
  } else {
    modifiedCSP += "; img-src 'self' https://cdn.shopify.com https://cdn.sanity.io data:";
  }
  
  // Update connect-src directive
  if (modifiedCSP.includes('connect-src')) {
    modifiedCSP = modifiedCSP.replace(
      /connect-src[^;]*/g,
      "connect-src 'self' https://monorail-edge.shopifysvc.com https://cdn.sanity.io https://cdn.shopify.com http://localhost:* ws://localhost:* ws://127.0.0.1:* ws://*.tryhydrogen.dev:*"
    );
  } else {
    modifiedCSP += "; connect-src 'self' https://monorail-edge.shopifysvc.com https://cdn.sanity.io https://cdn.shopify.com http://localhost:* ws://localhost:* ws://127.0.0.1:* ws://*.tryhydrogen.dev:*";
  }
  
  responseHeaders.set('Content-Security-Policy', modifiedCSP);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
