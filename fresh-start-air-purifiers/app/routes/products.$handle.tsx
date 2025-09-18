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
import { ProductForm } from '~/components/ProductForm';
import { SanityImage } from '~/components/SanityImage';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';

// Use the new or existing client
import { sanityClient } from '~/lib/sanityClient';

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
    sanityData: sanityData || {},
  };
}

function loadDeferredData({ context, params }: LoaderFunctionArgs) {
  return {};
}

export default function Product() {
  const { product, sanityData } = useLoaderData<typeof loader>();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product)
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const { title, descriptionHtml } = product;

  // Create array of product images for gallery
  const productImages = [
    selectedVariant?.image,
    // Add more images here when available
    // You can also fetch additional images from Sanity or Shopify
  ].filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="product-grid grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Product Image - Left Column */}
        <div className="order-1">
          <div className="sticky top-8">
            <div className="product-image-container mx-auto lg:mx-0">
              {/* Direct image render - no ProductImage component */}
              {selectedVariant?.image && (
                <img
                  src={selectedVariant.image.url}
                  alt={selectedVariant.image.altText || title}
                  className="w-full h-auto rounded-lg shadow-lg object-contain bg-white"
                  loading="lazy"
                />
              )}
            </div>
            
            {/* Product Image Gallery */}
            {productImages.length > 1 && (
              <div className="product-gallery">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Product Views</h3>
                <div className="gallery-thumbnails">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`gallery-thumbnail ${index === 0 ? 'active' : ''}`}
                      onClick={() => {
                        // TODO: Implement image switching functionality
                        console.log('Switch to image:', index);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          // TODO: Implement image switching functionality
                          console.log('Switch to image:', index);
                        }
                      }}
                      aria-label={`View ${title} image ${index + 1}`}
                    >
                      <img
                        src={image.url}
                        alt={image.altText || `${title} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Product Content - Right Column */}
        <div className="order-2 product-content flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900">{title}</h1>
            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
              className="text-2xl text-green-600 font-semibold mb-6"
            />
            
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
            />
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3 text-gray-900">Description</h2>
              <div
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                className="text-gray-700 leading-relaxed"
              />
            </div>

            {/* Enhanced Sections from Sanity */}
            {sanityData.detailedDescription && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">Detailed Overview</h2>
                <p className="text-gray-700 leading-relaxed">{sanityData.detailedDescription}</p>
              </section>
            )}

            {sanityData.allergyBenefits?.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">Allergy & Sensitivity Relief</h2>
                <ul className="space-y-4 list-disc pl-5">
                  {sanityData.allergyBenefits.map((benefit: { title: string; description: string }) => (
                    <li key={benefit.title} className="text-gray-700 leading-relaxed">
                      <strong className="text-gray-900">{benefit.title}:</strong> {benefit.description}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://freshairmama.com/allergy-tips"
                  className="text-blue-600 hover:text-blue-800 underline mt-4 inline-block transition-colors"
                >
                  Learn more on FreshAirMama
                </a>
              </section>
            )}

            {sanityData.maintenanceTips && (
              <section className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Easy Maintenance</h3>
                <p className="text-gray-700 leading-relaxed">{sanityData.maintenanceTips}</p>
              </section>
            )}

            {sanityData.relatedArticles?.length > 0 && (
              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Related Resources</h3>
                <ul className="space-y-3">
                  {sanityData.relatedArticles.map((article: { title: string; slug: { current: string } }) => (
                    <li key={article.slug.current}>
                      <a
                        href={`https://freshairmama.com/${article.slug.current}`}
                        className="text-blue-600 hover:text-blue-800 underline transition-colors"
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

      {/* Enhanced Product Content Sections with Different Background */}
      <div className="enhanced-content-section">
        {/* Technical Specifications */}
        {sanityData.technicalSpecs?.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Technical Specifications</h2>
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
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Key Features</h2>
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
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Technical Details & Cutaways</h2>
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
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Product Comparisons</h2>
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
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Installation Guide</h2>
            <div className="bg-white p-8 rounded-lg shadow-lg border max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
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
