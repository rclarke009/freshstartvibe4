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

  // Build extended env object
  // Start with hydrogenContext.env (which has Hydrogen's processed env vars)
  // Then explicitly add our custom env vars from the raw env object
  const extendedEnv = {
    ...hydrogenContext.env,
    // Always set CONTACT_EMAIL (with default fallback)
    CONTACT_EMAIL: env.CONTACT_EMAIL || 'contact@freshstartairpurifiers.com',
  };
  
  // Explicitly add RESEND_API_KEY from raw env if it exists and has a value
  // This ensures we preserve it even if Hydrogen filters it out
  const rawHasResendKey = env.RESEND_API_KEY !== undefined && env.RESEND_API_KEY !== null && env.RESEND_API_KEY !== '';
  if (rawHasResendKey && env.RESEND_API_KEY) {
    (extendedEnv as any).RESEND_API_KEY = env.RESEND_API_KEY;
  }

  return {
    ...hydrogenContext,
    // declare additional Remix loader context
    // Extend env with email service configuration
    env: extendedEnv,
  };
}
