import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  const page = data?.page;
  const title = page?.title 
    ? `Fresh Start Air Purifiers | ${page.title}`
    : 'Fresh Start Air Purifiers';
  
  const description = page?.seo?.description ||
    (page?.body ? page.body.replace(/<[^>]*>/g, '').substring(0, 160) : null) ||
    'Fresh Start Air Purifiers - Premium air purification solutions for your home or office.';
  
  return [
    { title },
    { name: 'description', content: description },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  request,
  params,
}: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: params.handle,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!page) {
    // Handle special case for choose-your-purifier
    if (params.handle === 'choose-your-purifier') {
      console.log('Returning coming soon page for choose-your-purifier');
      return {
        page: {
          title: 'Choose Your Purifier',
          handle: 'choose-your-purifier',
          isComingSoon: true
        }
      };
    }
    throw new Response('Not Found', {status: 404});
  }

  // Also handle the case where the page exists but we want to override it
  if (params.handle === 'choose-your-purifier') {
    console.log('Overriding existing page for choose-your-purifier');
    return {
      page: {
        title: 'Choose Your Purifier',
        handle: 'choose-your-purifier',
        isComingSoon: true
      }
    };
  }

  redirectIfHandleIsLocalized(request, {handle: params.handle, data: page});

  return {
    page,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();
  
  console.log('Page component rendered with:', page);

  // Handle coming soon page
  if (page.isComingSoon) {
    console.log('Rendering coming soon page');
    return (
      <div className="coming-soon-page">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1e40af] mb-6">
            Choose Your Purifier
          </h1>
          
          <div className="bg-[#F0F8FF] rounded-2xl p-8 md:p-12 mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1e40af] mb-4">
              Coming Soon!
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              We're working on an interactive tool to help you find the perfect air purifier for your needs. 
              This will include questions about your space, concerns, and preferences to give you personalized recommendations.
            </p>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-[#1e40af] mb-4">
                What to expect:
              </h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-[#1e40af] mr-2">•</span>
                  <span>Personalized recommendations based on your specific needs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#1e40af] mr-2">•</span>
                  <span>Room size and usage analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#1e40af] mr-2">•</span>
                  <span>Allergy and sensitivity considerations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#1e40af] mr-2">•</span>
                  <span>Noise level preferences</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#1e40af] mr-2">•</span>
                  <span>Budget-friendly options</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              In the meantime, you can browse our full collection of air purifiers:
            </p>
            <a 
              href="/collections/premium-purifiers" 
              className="inline-block bg-white border-2 border-[#1e40af] text-[#1e40af] px-8 py-3 rounded-lg font-semibold hover:bg-[#1e40af] hover:text-white transition-colors"
            >
              Shop All Purifiers
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header>
        <h1>{page.title}</h1>
      </header>
      <main dangerouslySetInnerHTML={{__html: page.body}} />
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
