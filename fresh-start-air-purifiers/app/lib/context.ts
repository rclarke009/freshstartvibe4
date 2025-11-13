import {createHydrogenContext} from '@shopify/hydrogen';
import {AppSession} from '~/lib/session';
import {CART_QUERY_FRAGMENT} from '~/lib/fragments';

/**
 * The context implementation is separate from server.ts
 * so that type can be extracted for AppLoadContext
 * */
export async function createAppLoadContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
  /**
   * Open a cache instance in the worker and a custom session instance.
   */
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  const hydrogenContext = createHydrogenContext({
    env,
    request,
    cache,
    waitUntil,
    session,
    i18n: {language: 'EN', country: 'US'},
    cart: {
      queryFragment: CART_QUERY_FRAGMENT,
    },
  });

  // Debug: Log environment variables in context.ts
  console.log('=== DEBUG: Context.ts Environment Variables ===');
  console.log('env.RESEND_API_KEY exists?', !!env.RESEND_API_KEY);
  console.log('env.RESEND_API_KEY value:', env.RESEND_API_KEY ? `${env.RESEND_API_KEY.substring(0, 5)}...` : 'NOT SET');
  console.log('env.CONTACT_EMAIL:', env.CONTACT_EMAIL || 'NOT SET');
  console.log('Available env keys in Env:', Object.keys(env || {}));
  console.log('==============================================');

  return {
    ...hydrogenContext,
    // declare additional Remix loader context
    // Extend env with email service configuration
    env: {
      ...hydrogenContext.env,
      // Explicitly pass through RESEND_API_KEY if it exists in the original env
      ...(env.RESEND_API_KEY && {RESEND_API_KEY: env.RESEND_API_KEY}),
      CONTACT_EMAIL: env.CONTACT_EMAIL || 'contact@freshstartairpurifiers.com',
    },
  };
}
