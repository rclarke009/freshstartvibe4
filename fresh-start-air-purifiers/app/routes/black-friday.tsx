import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {BlackFridayProductItem} from '~/components/BlackFridayProductItem';

export const meta: MetaFunction<typeof loader> = () => {
  return [
    { title: `Black Friday Sale | Fresh Start Air Purifiers` },
    {
      name: 'description',
      content: 'Breathe Better Blitz — Nov 28 to Dec 1 ONLY. Shop our Black Friday sale on Austin Air purifiers with special pricing.',
    },
  ];
};

export function links() {
  return [
    {
      rel: 'canonical',
      href: 'https://freshstartairpurifiers.com/black-friday',
    },
  ];
}

// Product handles for Black Friday sale items
// These should match the exact handles in Shopify
const BLACK_FRIDAY_PRODUCT_HANDLES = [
  'austin-air-immunity-machine', // ALL NEW Austin Immunity Machine
  'austin-bedroom-machine-air-purifier', // The Austin Air Bedroom Machine
  'austin-healthmate-junior-air-purifier', // The Austin Air HealthMate Plus Jr
  'austin-air-bedroom-machine-replacement-filter', // Bedroom Machine Replacement Filter
  'austin-air-immunity-machine-replacement-filter', // Immunity Machine Replacement Filter
];

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  // Query each product by handle in parallel
  const productQueries = BLACK_FRIDAY_PRODUCT_HANDLES.map((handle) =>
    storefront.query(PRODUCT_QUERY, {
      variables: {handle},
    }).catch((error) => {
      console.error(`Error fetching product ${handle}:`, error);
      return null;
    })
  );

  const results = await Promise.all(productQueries);
  
  // Extract products and filter out nulls
  const products = results
    .map((result) => result?.product)
    .filter((product) => product != null);

  // Sort by price descending (expensive first)
  products.sort((a, b) => {
    const priceA = parseFloat(a.priceRange.maxVariantPrice.amount);
    const priceB = parseFloat(b.priceRange.maxVariantPrice.amount);
    return priceB - priceA;
  });

  return {products};
}

export default function BlackFriday() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="black-friday-page">
      <div className="black-friday-header">
        <h1>Breathe Better Blitz</h1>
        <p className="black-friday-subtitle">Nov 28 to Dec 1 ONLY</p>
        <p className="black-friday-description">
          Shop our Black Friday sale on select Austin Air purifiers with special pricing.
        </p>
      </div>
      <div className="black-friday-products-grid">
        {products.map((product) => (
          <BlackFridayProductItem
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}

const BLACK_FRIDAY_PRODUCT_FRAGMENT = `#graphql
  fragment MoneyBlackFriday on MoneyV2 {
    amount
    currencyCode
  }
  fragment BlackFridayProduct on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyBlackFriday
      }
      maxVariantPrice {
        ...MoneyBlackFriday
      }
    }
    selectedOrFirstAvailableVariant {
      id
      price {
        ...MoneyBlackFriday
      }
      compareAtPrice {
        ...MoneyBlackFriday
      }
    }
  }
` as const;

const PRODUCT_QUERY = `#graphql
  query BlackFridayProduct(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...BlackFridayProduct
    }
  }
  ${BLACK_FRIDAY_PRODUCT_FRAGMENT}
` as const;

