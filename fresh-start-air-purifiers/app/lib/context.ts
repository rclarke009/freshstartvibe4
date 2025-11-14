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

  // DEBUG: Log environment variable access in context
  // Check if RESEND_API_KEY exists in raw env (the source of truth)
  const rawHasResendKey = env.RESEND_API_KEY !== undefined && env.RESEND_API_KEY !== null && env.RESEND_API_KEY !== '';
  const rawResendKeyValue = env.RESEND_API_KEY;
  
  console.log('[CONTEXT DEBUG] ===== Environment Variable Debug =====');
  console.log('[CONTEXT DEBUG] Raw env.RESEND_API_KEY exists:', 'RESEND_API_KEY' in env);
  console.log('[CONTEXT DEBUG] Raw env.RESEND_API_KEY type:', typeof rawResendKeyValue);
  console.log('[CONTEXT DEBUG] Raw env.RESEND_API_KEY value:', rawResendKeyValue ? `[SET, length: ${rawResendKeyValue.length}]` : '[NOT SET]');
  console.log('[CONTEXT DEBUG] Raw env.RESEND_API_KEY is truthy:', !!rawResendKeyValue);
  console.log('[CONTEXT DEBUG] Raw env.RESEND_API_KEY is non-empty:', rawHasResendKey);
  console.log('[CONTEXT DEBUG] hydrogenContext.env type:', typeof hydrogenContext.env);
  console.log('[CONTEXT DEBUG] hydrogenContext.env keys:', Object.keys(hydrogenContext.env || {}));
  console.log('[CONTEXT DEBUG] hydrogenContext.env has RESEND_API_KEY:', 'RESEND_API_KEY' in (hydrogenContext.env || {}));
  
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
  if (rawHasResendKey && rawResendKeyValue) {
    (extendedEnv as any).RESEND_API_KEY = rawResendKeyValue;
    console.log('[CONTEXT DEBUG] ✅ Added RESEND_API_KEY to extendedEnv (length:', rawResendKeyValue.length, ')');
  } else {
    console.log('[CONTEXT DEBUG] ❌ RESEND_API_KEY NOT added - missing or empty in raw env');
    console.log('[CONTEXT DEBUG] Raw env keys:', Object.keys(env));
  }
  
  // Final verification
  console.log('[CONTEXT DEBUG] Extended env.RESEND_API_KEY exists:', 'RESEND_API_KEY' in extendedEnv);
  console.log('[CONTEXT DEBUG] Extended env.RESEND_API_KEY value:', (extendedEnv as any).RESEND_API_KEY ? `[SET, length: ${(extendedEnv as any).RESEND_API_KEY.length}]` : '[NOT SET]');
  console.log('[CONTEXT DEBUG] Extended env keys:', Object.keys(extendedEnv));
  console.log('[CONTEXT DEBUG] ========================================');

  return {
    ...hydrogenContext,
    // declare additional Remix loader context
    // Extend env with email service configuration
    env: extendedEnv,
  };
}
