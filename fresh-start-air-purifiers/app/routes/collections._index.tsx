import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

export const meta: MetaFunction<typeof loader> = ({data, location}) => {
  const origin = data?.origin || 'https://freshstartairpurifiers.com';
  const pageUrl = `${origin}${location.pathname}`;
  const pageImage = `${origin}/fresh-start-air-purifiers-logo-no-bkgd.png`;
  const title = 'Fresh Start Air Purifiers | Collections';
  const description =
    'Explore Austin Air purifier collections with medical-grade HEPA + heavy carbon filtration for homes, offices, and sensitive environments.';

  return [
    {title},
    {name: 'description', content: description},
    // Open Graph tags
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:image', content: pageImage},
    {property: 'og:url', content: pageUrl},
    {property: 'og:type', content: 'website'},
    {property: 'og:site_name', content: 'Fresh Start Air Purifiers'},
    // Twitter Card tags
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
    {name: 'twitter:image', content: pageImage},
  ];
};

export function links(args?: {
  data?: Awaited<ReturnType<typeof loader>>;
  location?: {pathname: string};
}) {
  if (!args?.data || !args?.location) return [];
  const origin = args.data.origin || 'https://freshstartairpurifiers.com';
  return [
    {
      rel: 'canonical',
      href: `${origin}${args.location.pathname}`,
    },
  ];
}

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  // Get origin URL for SEO
  const url = new URL(args.request.url);

  return {...deferredData, ...criticalData, origin: url.origin};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {collections};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collections() {
  const {collections, origin} = useLoaderData<typeof loader>();
  const pageUrl = `${origin || 'https://freshstartairpurifiers.com'}/collections`;

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Collections',
    description:
      'Explore Austin Air purifier collections with medical-grade HEPA + heavy carbon filtration for homes, offices, and sensitive environments.',
    url: pageUrl,
    publisher: {
      '@type': 'Organization',
      name: 'Fresh Start Air Purifiers',
      logo: {
        '@type': 'ImageObject',
        url: `${origin || 'https://freshstartairpurifiers.com'}/fresh-start-air-purifiers-logo-no-bkgd.png`,
      },
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: collections?.nodes?.map((collection: CollectionFragment, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Collection',
          name: collection.title,
          url: `${origin || 'https://freshstartairpurifiers.com'}/collections/${collection.handle}`,
          image: collection.image?.url,
        },
      })) || [],
    },
  };

  return (
    <div className="collections">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}
      />
      <h1>Collections</h1>
      <PaginatedResourceSection
        connection={collections}
        resourcesClassName="collections-grid"
      >
        {({node: collection, index}) => (
          <CollectionItem
            key={collection.id}
            collection={collection}
            index={index}
          />
        )}
      </PaginatedResourceSection>
    </div>
  );
}

function CollectionItem({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  return (
    <Link
      className="collection-item"
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      {collection?.image && (
        <Image
          alt={collection.image.altText || collection.title}
          aspectRatio="1/1"
          data={collection.image}
          loading={index < 3 ? 'eager' : undefined}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <h5>{collection.title}</h5>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;
