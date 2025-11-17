import { redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, type MetaFunction, useLocation } from '@remix-run/react';
import { useState, useEffect, useCallback } from 'react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import type { SelectedOption } from '@shopify/hydrogen/storefront-api-types';
import { ProductPrice } from '~/components/ProductPrice';
import { ProductForm } from '~/components/ProductForm';
import { SanityImage } from '~/components/SanityImage';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';

// Use the new or existing client
import { sanityClient } from '~/lib/sanityClient';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const product = data?.product;
  const origin = data?.origin || 'https://freshstartairpurifiers.com';
  const title = product?.title 
    ? `Fresh Start Air Purifiers | ${product.title}`
    : 'Fresh Start Air Purifiers | Product';
  
  const description = product?.seo?.description || 
    (product?.description ? product.description.replace(/<[^>]*>/g, '').substring(0, 150) : null) ||
    `Shop ${product?.title || 'premium air purifiers'} from Fresh Start Air Purifiers. Medical-grade HEPA + heavy carbon removes VOCs, fragrances, pollen, and mold.`;
  
  const productUrl = product?.handle 
    ? `${origin}/products/${product.handle}`
    : origin;
  
  const productImage = product?.featuredImage?.url || 
    product?.selectedOrFirstAvailableVariant?.image?.url ||
    `${origin}/fresh-start-air-purifiers-logo-no-bkgd.png`;
  
  const productImageObj = product?.featuredImage || 
    product?.selectedOrFirstAvailableVariant?.image ||
    null;
  
  const productImageWidth = productImageObj?.width?.toString() || '1200';
  const productImageHeight = productImageObj?.height?.toString() || '630';
  const productImageAlt = productImageObj?.altText || title;
  
  const price = product?.selectedOrFirstAvailableVariant?.price?.amount;
  const currency = product?.selectedOrFirstAvailableVariant?.price?.currencyCode || 'USD';
  
  return [
    { title },
    { name: 'description', content: description },
    { name: 'robots', content: 'index, follow' },
    // Open Graph tags
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: productImage },
    { property: 'og:image:width', content: productImageWidth },
    { property: 'og:image:height', content: productImageHeight },
    { property: 'og:image:alt', content: productImageAlt },
    { property: 'og:url', content: productUrl },
    { property: 'og:type', content: 'product' },
    { property: 'og:site_name', content: 'Fresh Start Air Purifiers' },
    { property: 'og:locale', content: 'en_US' },
    ...(price ? [
      { property: 'product:price:amount', content: price },
      { property: 'product:price:currency', content: currency },
    ] : []),
    // Twitter Card tags
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: productImage },
    { name: 'twitter:image:alt', content: productImageAlt },
  ];
};

export function links(args?: { data?: Awaited<ReturnType<typeof loader>> }) {
  if (!args?.data) return [];
  const product = args.data.product;
  const origin = args.data.origin || 'https://freshstartairpurifiers.com';
  const canonicalUrl = product?.handle 
    ? `${origin}/products/${product.handle}`
    : origin;
  
  return [
    {
      rel: 'canonical',
      href: canonicalUrl,
    },
  ];
}

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
  const url = new URL(request.url);

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // Normalize common short handles to canonical slugs and redirect
  const redirectMap: Record<string, string> = {
    'healthmate': 'austin-air-purifier-healthmate',
    'healthmate-plus': 'austin-healthmate-plus-air-purifier',
    'healthmate-jr': 'austin-healthmate-junior-air-purifier',
    'healthmate-jr-plus': 'austin-healthmate-junior-plus-air-purifier',
    'bedroom': 'austin-bedroom-machine-air-purifier',
    'allergy': 'austin-bedroom-machine-air-purifier',
    'allergy-jr': 'austin-bedroom-machine-air-purifier',
    'immunity': 'austin-air-immunity-machine',
  };

  const canonical = redirectMap[handle];
  if (canonical && canonical !== handle) {
    return redirect(`/products/${canonical}${url.search || ''}`, {
      status: 301,
    });
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

  // Fetch policies from Shopify
  const policiesData = await storefront.query(POLICIES_QUERY, {
    variables: {
      language: context.storefront.i18n?.language,
      country: context.storefront.i18n?.country,
    },
  });

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

  // Determine if product is purifier or accessory
  const isAccessory = isProductAccessory(product);

  return {
    product,
    sanityData: sanityData || {},
    origin: url.origin,
    policies: {
      shipping: policiesData?.shop?.shippingPolicy || null,
      refund: policiesData?.shop?.refundPolicy || null,
    },
    isAccessory,
  };
}

function loadDeferredData({ context, params }: LoaderFunctionArgs) {
  return {};
}

export default function Product() {
  const { product, sanityData, origin, policies, isAccessory } = useLoaderData<typeof loader>();
  const [showQuizBanner, setShowQuizBanner] = useState(false);
  const location = useLocation();
  
  // Track selected options in state to make variant selection reactive to button clicks
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>(() => {
    // Initialize from URL params
    const urlParams = new URLSearchParams(location.search);
    return Array.from(urlParams.entries())
      .filter(([key]) => key !== 'from') // Exclude non-variant params
      .map(([name, value]) => ({ name, value }));
  });

  // Check for quiz query parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('from') === 'quiz') {
      setShowQuizBanner(true);
      // Auto-hide after 5 seconds
      setTimeout(() => setShowQuizBanner(false), 5000);
    }
  }, []);

  // Update selected options when URL changes (e.g., from navigation)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const optionsFromUrl = Array.from(urlParams.entries())
      .filter(([key]) => key !== 'from')
      .map(([name, value]) => ({ name, value }));
    
    setSelectedOptions((prevOptions) => {
      // Only update if different to avoid unnecessary re-renders
      const optionsMatch = optionsFromUrl.length === prevOptions.length &&
        optionsFromUrl.every((opt) =>
          prevOptions.some(
            (s) => s.name.toLowerCase() === opt.name.toLowerCase() && s.value === opt.value
          )
        );
      
      return optionsMatch ? prevOptions : optionsFromUrl;
    });
  }, [location.search]);

  // Find the variant that matches the current selected options
  const allVariants = getAdjacentAndFirstAvailableVariants(product);
  const variantFromState = allVariants.find((variant) => {
    if (!variant.selectedOptions || selectedOptions.length === 0) return false;
    return selectedOptions.every(({ name, value }) =>
      variant.selectedOptions.some(
        (opt) => opt.name.toLowerCase() === name.toLowerCase() && opt.value === value
      )
    ) && variant.selectedOptions.length === selectedOptions.length;
  });

  const selectedVariant = useOptimisticVariant(
    variantFromState || product.selectedOrFirstAvailableVariant,
    allVariants
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Callback to update selected options when variant option is clicked
  const handleVariantOptionChange = useCallback((newOptions: SelectedOption[]) => {
    setSelectedOptions(newOptions);
  }, []);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const { title, descriptionHtml } = product;

  // Choose a primary image with graceful fallbacks
  const primaryImage = selectedVariant?.image || product?.featuredImage || null;

  // Create array of product images for gallery (can be expanded later)
  const productImages = [primaryImage].filter(Boolean);

  // Build structured data for SEO
  const productUrl = `${origin}/products/${product.handle}`;
  const productImage = primaryImage?.url || `${origin}/fresh-start-air-purifiers-logo-no-bkgd.png`;
  const price = selectedVariant?.price?.amount;
  const currency = selectedVariant?.price?.currencyCode || 'USD';
  const availability = selectedVariant?.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
  const description = product.seo?.description || product.description?.replace(/<[^>]*>/g, '').substring(0, 300) || '';
  
  // Collect all product images for structured data
  const allProductImages = [
    primaryImage?.url,
    product?.featuredImage?.url,
    ...(product?.adjacentVariants || [])
      .map((v: any) => v?.image?.url)
      .filter(Boolean)
  ].filter((url, index, self) => url && self.indexOf(url) === index); // Remove duplicates
  
  const productStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description,
    image: allProductImages.length > 0 ? allProductImages : productImage,
    brand: {
      '@type': 'Brand',
      name: product.vendor || 'Austin Air',
    },
    sku: selectedVariant?.sku || '',
    mpn: selectedVariant?.sku || '',
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: currency,
      price: price || '0',
      availability,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      seller: {
        '@type': 'Organization',
        name: 'Fresh Start Air Purifiers',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: isAccessory ? '15' : '0',
          currency,
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'US',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'd',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 4,
            maxValue: 7,
            unitCode: 'd',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'US',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
        returnPolicyUrl: policies?.refund?.url || `${origin}/policies/refund-policy`,
      },
    },
  };

  // BreadcrumbList structured data
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: origin,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: `${origin}/collections`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: productUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Quiz Success Banner */}
      {showQuizBanner && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center">
            <span className="text-green-600 text-lg mr-2">✓</span>
            <span className="text-green-800 font-medium">
              Perfect match! This purifier was recommended based on your quiz answers.
            </span>
          </div>
        </div>
      )}
      <div className="product-grid grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Product Image - Left Column */}
        <div className="order-1 lg:order-1">
          <div className="sticky top-8">
            <div className="product-image-container mx-auto lg:mx-0">
              {/* Direct image render with fallback to product.featuredImage */}
              {primaryImage ? (
                <img
                  key={selectedVariant?.id || primaryImage.id || primaryImage.url}
                  src={primaryImage.url}
                  alt={primaryImage.altText || `${title}${selectedVariant?.title && selectedVariant.title !== 'Default Title' ? ` - ${selectedVariant.title}` : ''}`}
                  className="w-full h-auto rounded-lg shadow-lg object-contain bg-white"
                  loading="lazy"
                  width={primaryImage.width || undefined}
                  height={primaryImage.height || undefined}
                />
              ) : (
                <img
                  src="/fresh-start-air-purifiers-logo-no-bkgd.png"
                  alt={title}
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
        <div className="order-2 lg:order-2 product-content flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900">{title}</h1>
            
            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
              className="text-2xl text-green-600 font-semibold mb-6"
            />
            <br />
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
              onVariantOptionChange={handleVariantOptionChange}
            />
            
            <br />

            {/* Free Shipping - Only for Purifiers */}
            {!isAccessory && (
              <div className="inline-block mt-4 text-[15px] font-semibold text-neutral-900" style={{ 
                borderRadius: '0.5rem', 
                border: '1px solid #FFFBF0', 
                backgroundColor: '#FFFBF0', 
                outline: 'none',
                boxShadow: 'none',
                padding: '0.75rem 1.25rem'
              }}>
                Free Shipping on All Air Purifiers (Continental U.S.)
              </div>
            )}

            {/* Free Shipping - For Replacement Filters */}
            {isReplacementFilter(product) && (
              <div className="inline-block mt-4 text-[15px] font-semibold text-neutral-900" style={{ 
                borderRadius: '0.5rem', 
                border: '1px solid #FFFBF0', 
                backgroundColor: '#FFFBF0', 
                outline: 'none',
                boxShadow: 'none',
                padding: '0.75rem 1.25rem'
              }}>
                Free Shipping on Replacement Filters (Continental U.S.)
              </div>
            )}

            {/* Delivery Time Information */}
            <div className="mt-3 text-sm text-neutral-700">
              <br></br>
              Orders are fulfilled and shipped directly by Austin Air. Typical delivery is 7–10 business days.
            </div>

            <br  />
            
            <br />
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3 text-gray-900">Description</h2>
              <div
                dangerouslySetInnerHTML={{ 
                  __html: descriptionHtml?.replace(/<h1[^>]*>/gi, '<h2>').replace(/<\/h1>/gi, '</h2>') || '' 
                }}
                className="text-gray-700 leading-relaxed"
              />
            </div>

            <br />

            {/* Returns Info */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3 text-gray-900">Returns</h2>
              <p className="text-sm text-neutral-700">
                30-day returns (except for manufacturing defects).{' '}
                {policies?.refund?.url ? (
                  <a 
                    href={policies.refund.url} 
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    See our Return Policy
                  </a>
                ) : (
                  <a 
                    href="/policies/refund-policy" 
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    See our Return Policy
                  </a>
                )}{' '}
                for details.
              </p>
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
    </>
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
    productType
    tags
    featuredImage {
      __typename
      id
      url
      altText
      width
      height
    }
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

const POLICIES_QUERY = `#graphql
  fragment PolicyItemProduct on ShopPolicy {
    id
    title
    handle
    url
  }
  query ProductPolicies($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      shippingPolicy {
        ...PolicyItemProduct
      }
      refundPolicy {
        ...PolicyItemProduct
      }
    }
  }
` as const;

// Helper function to determine if product is an accessory
function isProductAccessory(product: any): boolean {
  if (!product) return false;
  
  // Check product type
  const productType = product.productType?.toLowerCase() || '';
  if (productType.includes('filter') || productType.includes('accessory') || productType.includes('replacement')) {
    return true;
  }
  
  // Check tags
  const tags = product.tags || [];
  const tagString = tags.join(' ').toLowerCase();
  if (tagString.includes('filter') || tagString.includes('accessory') || tagString.includes('replacement')) {
    return true;
  }
  
  // Check handle patterns
  const handle = product.handle?.toLowerCase() || '';
  if (handle.includes('filter') || handle.includes('replacement') || handle.includes('pre-filter')) {
    return true;
  }
  
  // Default to purifier if unclear
  return false;
}

// Helper function to determine if product is a replacement filter (not pre-filter)
function isReplacementFilter(product: any): boolean {
  if (!product) return false;
  
  const handle = product.handle?.toLowerCase() || '';
  const productType = product.productType?.toLowerCase() || '';
  const tags = (product.tags || []).join(' ').toLowerCase();
  
  // Must contain "replacement" but NOT "pre-filter"
  const hasReplacement = handle.includes('replacement-filter') || 
                         productType.includes('replacement') ||
                         tags.includes('replacement');
  const isPreFilter = handle.includes('pre-filter') || 
                      productType.includes('pre-filter') ||
                      tags.includes('pre-filter');
  
  return hasReplacement && !isPreFilter;
}
