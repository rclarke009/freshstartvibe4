import { redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, type MetaFunction } from '@remix-run/react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import { ProductPrice } from '~/components/ProductPrice';
import { ProductImage } from '~/components/ProductImage';
import { ProductForm } from '~/components/ProductForm';
import { SanityImage } from '~/components/SanityImage';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';

// Use the new or existing client
import { sanityClient } from '~/lib/sanityClient'; // Adjust if found elsewhere

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Hydrogen | ${data?.product.title ?? ''}` },
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return { ...deferredData, ...criticalData };
}

/**
 * Load data necessary for rendering content above the fold.
 */
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const { handle } = params;
  const { storefront } = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{ product }] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: { handle, selectedOptions: getSelectedProductOptions(request) },
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, { status: 404 });
  }

  redirectIfHandleIsLocalized(request, { handle, data: product });

  // Fetch additional product data
  const sanityData = await sanityClient.fetch(
    `*[_type == "product" && slug.current == $handle][0]{
      detailedDescription,
      allergyBenefits[] { title, description },
      maintenanceTips,
      relatedArticles[]-> { title, slug { current } },
      cutawayImages[] {
        asset->,
        alt,
        caption,
        category
      },
      comparisonSheets[] {
        asset->,
        alt,
        caption,
        competitor
      },
      technicalSpecs[] {
        category,
        specs[] {
          name,
          value,
          unit
        }
      },
      features[] {
        title,
        description,
        icon
      },
      installationGuide
    }`,
    { handle }
  );

  return {
    product,
    sanityData: sanityData || {}, // Fallback
  };
}

// ... (rest of the file remains the same)

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context, params }: LoaderFunctionArgs) {
  // Put any API calls that are not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.
  return {};
}

export default function Product() {
  const { product, sanityData } = useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product)
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const { title, descriptionHtml } = product;

  return (
    
<div className="container mx-auto px-4 py-8">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
    {/* Product Image */}
    <div className="relative overflow-hidden max-h-64"> {/* Added max-h-64 to container */}
      <ProductImage
        image={selectedVariant?.image}
        className="w-full max-h-64 rounded-lg shadow-lg object-contain"
        loading="lazy"
      />
    </div>
    <div className="flex flex-col space-y-6"> {/* Changed justify-between to space-y-6 for consistent spacing */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <ProductPrice
          price={selectedVariant?.price}
          compareAtPrice={selectedVariant?.compareAtPrice}
          className="text-2xl text-green-600 font-semibold mb-4"
        />
        <br />
        <ProductForm
          productOptions={productOptions}
          selectedVariant={selectedVariant}
        />
        <br />
        <br />
        <p className="font-semibold">Description</p>
        <br />
        <div
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          className="text-gray-700 mb-6"
        />
        <br />
        {/* Enhanced Sections from Sanity */}
        {sanityData.detailedDescription && (
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Detailed Overview</h2>
            <p className="text-gray-700">{sanityData.detailedDescription}</p>
          </section>
        )}
        {sanityData.allergyBenefits?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Allergy & Sensitivity Relief</h2>
            <ul className="space-y-4 list-disc pl-5">
              {sanityData.allergyBenefits.map((benefit: { title: string; description: string }) => (
                <li key={benefit.title} className="text-gray-700">
                  <strong>{benefit.title}:</strong> {benefit.description}
                </li>
              ))}
            </ul>
            <a
              href="https://freshairmama.com/allergy-tips"
              className="text-blue-600 underline mt-4 inline-block"
            >
              Learn more on FreshAirMama
            </a>
          </section>
        )}
        {sanityData.maintenanceTips && (
          <section className="mb-6 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Easy Maintenance</h3>
            <p className="text-gray-700">{sanityData.maintenanceTips}</p>
          </section>
        )}
        {sanityData.relatedArticles?.length > 0 && (
          <section className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Related Resources</h3>
            <ul className="space-y-2">
              {sanityData.relatedArticles.map((article: { title: string; slug: { current: string } }) => (
                <li key={article.slug.current}>
                  <a
                    href={`https://freshairmama.com/${article.slug.current}`}
                    className="text-blue-600 underline"
                  >
                    {article.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  </div>

  {/* Enhanced Product Content Sections */}
  <div className="container mx-auto px-4 py-8">
    {/* Technical Specifications */}
    {sanityData.technicalSpecs?.length > 0 && (
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Technical Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sanityData.technicalSpecs.map((category: any, index: number) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg border">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{category.category}</h3>
              <div className="space-y-3">
                {category.specs.map((spec: any, specIndex: number) => (
                  <div key={specIndex} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{spec.name}</span>
                    <span className="text-gray-600">
                      {spec.value}{spec.unit && ` ${spec.unit}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Key Features */}
    {sanityData.features?.length > 0 && (
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sanityData.features.map((feature: any, index: number) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg border text-center">
              {feature.icon && (
                <div className="text-4xl mb-3">🔧</div>
              )}
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Cutaway & Technical Images */}
    {sanityData.cutawayImages?.length > 0 && (
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Technical Details & Cutaways</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sanityData.cutawayImages.map((image: any, index: number) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-lg border">
              <SanityImage 
                asset={image.asset} 
                alt={image.alt || 'Technical detail'} 
                className="w-full h-64 object-cover rounded-lg mb-3"
              />
              {image.caption && (
                <p className="text-sm text-gray-600 text-center">{image.caption}</p>
              )}
              {image.category && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">
                  {image.category}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Comparison Sheets */}
    {sanityData.comparisonSheets?.length > 0 && (
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Product Comparisons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sanityData.comparisonSheets.map((sheet: any, index: number) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-lg border">
              <SanityImage 
                asset={sheet.asset} 
                alt={sheet.alt || 'Comparison sheet'} 
                className="w-full h-auto object-contain rounded-lg mb-3"
              />
              {sheet.caption && (
                <p className="text-sm text-gray-600 text-center mb-2">{sheet.caption}</p>
              )}
              {sheet.competitor && (
                <div className="text-center">
                  <span className="inline-block bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full">
                    vs {sheet.competitor}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Installation Guide */}
    {sanityData.installationGuide && (
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Installation Guide</h2>
        <div className="bg-white p-8 rounded-lg shadow-lg border max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            {/* You'll need to render the portable text here */}
            <p className="text-gray-700">{sanityData.installationGuide}</p>
          </div>
        </div>
      </section>
    )}
  </div>
  <Analytics.ProductView
    data={{
      products: [
        {
          id: product.id,
          title: product.title,
          price: selectedVariant?.price.amount || '0',
          vendor: product.vendor,
          variantId: selectedVariant?.id || '',
          variantTitle: selectedVariant?.title || '',
          quantity: 1,
        },
      ],
    }}
  />
</div>
 
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

// import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
// import {useLoaderData, type MetaFunction} from '@remix-run/react';
// import {
//   getSelectedProductOptions,
//   Analytics,
//   useOptimisticVariant,
//   getProductOptions,
//   getAdjacentAndFirstAvailableVariants,
//   useSelectedOptionInUrlParam,
// } from '@shopify/hydrogen';
// import {ProductPrice} from '~/components/ProductPrice';
// import {ProductImage} from '~/components/ProductImage';
// import {ProductForm} from '~/components/ProductForm';
// import {redirectIfHandleIsLocalized} from '~/lib/redirect';

// export const meta: MetaFunction<typeof loader> = ({data}) => {
//   return [
//     {title: `Hydrogen | ${data?.product.title ?? ''}`},
//     {
//       rel: 'canonical',
//       href: `/products/${data?.product.handle}`,
//     },
//   ];
// };

// export async function loader(args: LoaderFunctionArgs) {
//   // Start fetching non-critical data without blocking time to first byte
//   const deferredData = loadDeferredData(args);

//   // Await the critical data required to render initial state of the page
//   const criticalData = await loadCriticalData(args);

//   return {...deferredData, ...criticalData};
// }

// /**
//  * Load data necessary for rendering content above the fold. This is the critical data
//  * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
//  */
// async function loadCriticalData({
//   context,
//   params,
//   request,
// }: LoaderFunctionArgs) {
//   const {handle} = params;
//   const {storefront} = context;

//   if (!handle) {
//     throw new Error('Expected product handle to be defined');
//   }

//   const [{product}] = await Promise.all([
//     storefront.query(PRODUCT_QUERY, {
//       variables: {handle, selectedOptions: getSelectedProductOptions(request)},
//     }),
//     // Add other queries here, so that they are loaded in parallel
//   ]);

//   if (!product?.id) {
//     throw new Response(null, {status: 404});
//   }

//   // The API handle might be localized, so redirect to the localized handle
//   redirectIfHandleIsLocalized(request, {handle, data: product});

//   return {
//     product,
//   };
// }

// /**
//  * Load data for rendering content below the fold. This data is deferred and will be
//  * fetched after the initial page load. If it's unavailable, the page should still 200.
//  * Make sure to not throw any errors here, as it will cause the page to 500.
//  */
// function loadDeferredData({context, params}: LoaderFunctionArgs) {
//   // Put any API calls that is not critical to be available on first page render
//   // For example: product reviews, product recommendations, social feeds.

//   return {};
// }

// export default function Product() {
//   const {product} = useLoaderData<typeof loader>();

//   // Optimistically selects a variant with given available variant information
//   const selectedVariant = useOptimisticVariant(
//     product.selectedOrFirstAvailableVariant,
//     getAdjacentAndFirstAvailableVariants(product),
//   );

//   // Sets the search param to the selected variant without navigation
//   // only when no search params are set in the url
//   useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

//   // Get the product options array
//   const productOptions = getProductOptions({
//     ...product,
//     selectedOrFirstAvailableVariant: selectedVariant,
//   });

//   const {title, descriptionHtml} = product;

//   return (
//     <div className="product">
//       <ProductImage image={selectedVariant?.image} />
//       <div className="product-main">
//         <h1>{title}</h1>
//         <ProductPrice
//           price={selectedVariant?.price}
//           compareAtPrice={selectedVariant?.compareAtPrice}
//         />
//         <br />
//         <ProductForm
//           productOptions={productOptions}
//           selectedVariant={selectedVariant}
//         />
//         <br />
//         <br />
//         <p>
//           <strong>Description</strong>
//         </p>
//         <br />
//         <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
//         <br />
//       </div>
//       <Analytics.ProductView
//         data={{
//           products: [
//             {
//               id: product.id,
//               title: product.title,
//               price: selectedVariant?.price.amount || '0',
//               vendor: product.vendor,
//               variantId: selectedVariant?.id || '',
//               variantTitle: selectedVariant?.title || '',
//               quantity: 1,
//             },
//           ],
//         }}
//       />
//     </div>
//   );
// }

// const PRODUCT_VARIANT_FRAGMENT = `#graphql
//   fragment ProductVariant on ProductVariant {
//     availableForSale
//     compareAtPrice {
//       amount
//       currencyCode
//     }
//     id
//     image {
//       __typename
//       id
//       url
//       altText
//       width
//       height
//     }
//     price {
//       amount
//       currencyCode
//     }
//     product {
//       title
//       handle
//     }
//     selectedOptions {
//       name
//       value
//     }
//     sku
//     title
//     unitPrice {
//       amount
//       currencyCode
//     }
//   }
// ` as const;

// const PRODUCT_FRAGMENT = `#graphql
//   fragment Product on Product {
//     id
//     title
//     vendor
//     handle
//     descriptionHtml
//     description
//     encodedVariantExistence
//     encodedVariantAvailability
//     options {
//       name
//       optionValues {
//         name
//         firstSelectableVariant {
//           ...ProductVariant
//         }
//         swatch {
//           color
//           image {
//             previewImage {
//               url
//             }
//           }
//         }
//       }
//     }
//     selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
//       ...ProductVariant
//     }
//     adjacentVariants (selectedOptions: $selectedOptions) {
//       ...ProductVariant
//     }
//     seo {
//       description
//       title
//     }
//   }
//   ${PRODUCT_VARIANT_FRAGMENT}
// ` as const;

// const PRODUCT_QUERY = `#graphql
//   query Product(
//     $country: CountryCode
//     $handle: String!
//     $language: LanguageCode
//     $selectedOptions: [SelectedOptionInput!]!
//   ) @inContext(country: $country, language: $language) {
//     product(handle: $handle) {
//       ...Product
//     }
//   }
//   ${PRODUCT_FRAGMENT}
// ` as const;
