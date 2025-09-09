///Users/rebeccaclarke/Documents/WebFiles/CurrentWorkingDirectory/freshstartvibe4/fresh-start-air-purifiers/app/routes/_index.tsx

import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import type {
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';

export const meta: MetaFunction = () => {
  return [{title: 'Fresh Start Air Purifiers | Bring the Fresh Air Indoors'}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  return {...deferredData};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <main id="main-content">
      {/* Hero section - Only on homepage */}
      <Hero />
      {/* Content sections */}
      <div className="content-sections">
        <ProblemValidation />
        <TrustAuthority />
        <SocialProof />
        <RecommendedProducts products={data.recommendedProducts} />
      </div>
      </main>
    </div>
  );
}

// Hero component - Only appears on homepage
function Hero() {
  return (
    <section className="hero-bleed w-full">
      {/* Hero image - fixed aspect ratio container for predictable cropping */}
      <div className="hero-image-container">
        <img
          src="/hero-livingroom.jpg"
          alt="Calm, clean living room with fresh air"
          loading="eager"
          decoding="async"
        />
        {/* Optional subtle overlay for text readability */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
      
      {/* Hero content - centered below the image */}
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="text-3xl md:text-5xl font-bold text-[#1e40af] mb-4 md:mb-6">
            Bring the fresh air indoors
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-[#1e40af] mb-4 md:mb-6 max-w-4xl mx-auto">
            Air Purifiers provide fresh, natural air — without the pollen, mold, or chemicals.
          </p>
          <p className="text-base md:text-lg text-gray-600/70 mb-6 md:mb-8 max-w-2xl mx-auto">
            Real protection from fragrance, VOCs, dust, and mold—trusted in hospitals and sensitive homes.
          </p>
        </div>
        <div className="hero-cta">
          <a
            href="#guide"
            className="add-to-cart-button"
          >
            Find your filter
          </a>
        </div>
      </div>
    </section>
  );
}

// 2) Problem → "you're not crazy" validation
function ProblemValidation() {
  return (
    <div className="section-bleed bg-slate-50/60">
      <section id="why-bother" className="mt-10 md:mt-14">
        <div className="p-6 md:p-8 lg:p-12">

       
        <div className="mt-8 two-column-layout">
          <div className="left-column space-y-6" style={{flex: '1', minWidth: '0', maxWidth: '100%'}}>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1e40af]">
            &ldquo;I already have a basic purifier… why am I still not feeling better?&rdquo;
          </h2>
          <br />
            <ul className="problem-list space-y-4 text-gray-700/85">
              <li className="flex gap-3">
                <span className="bullet" />
                <p>
                  <span className="font-medium">Fragrance & VOCs</span> — from cleaning products, paint, and new flooring — slip through most filters designed only for dust.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="bullet" />
                <p>
                  <span className="font-medium">PM2.5 particles</span> — released by gas stoves, candles, smog, and wildfire smoke — are too small for cheap filters to trap.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="bullet" />
                <p>
                  <span className="font-medium">Mold & allergens</span> — microscopic spores and particles sneak past basic air purifier systems.
                </p>
              </li>
            </ul>
            <p className="text-gray-700/90">
              That&apos;s why <span className="font-semibold">Austin Air</span> goes beyond basic HEPA—combining medical-grade HEPA with heavy carbon to capture what others leave behind.
            </p>
            <a
              href="#guide"
              className="inline-block rounded-xl bg-[#1e40af] px-5 py-3 font-semibold text-white shadow hover:bg-[#1e3a8a] transition-colors"
            >
              Compare models
            </a>
          </div>
          <div className="right-column" style={{width: '100%', flexShrink: '0', display: 'flex', justifyContent: 'center'}}>
            <img
              src="/fresh-start-air-purifiers-cutaway-why.jpg"
              alt="Air purifier cutaway illustrating fragrance and VOC filtration challenges"
              className="w-full h-auto rounded-2xl shadow-lg responsive-image"
            />
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}


function TrustAuthority() {
  return (
    <div className="section-bleed bg-[#F0F8FF]">
      <section id="serious-filtration" className="mt-10 md:mt-14">
        <div className="p-6 md:p-8 lg:p-12">
          <div className="mt-8 two-column-layout">
            <div className="left-column space-y-6" style={{flex: '1', minWidth: '0', maxWidth: '100%', display: 'flex', justifyContent: 'center'}}>
              <img
                src="/fresh-start-air-purifiers-schools.jpg"
                alt="Austin Air purifiers trusted by schools and hospitals"
                className="w-full h-auto rounded-2xl shadow-lg responsive-image"
              />
            </div>
            <div className="right-column" style={{width: '400px', flexShrink: '0', display: 'flex', justifyContent: 'center'}}>
              <div className="grid gap-4 pr-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#1e40af]">
                  &ldquo;Serious filtration for homes, offices, hospitals and schools&rdquo;
                </h2>
                <br />
                <ul className="problem-list space-y-4 text-gray-700/85">
                  <li className="flex gap-3">
                    <span className="bullet" />
                    <p>
                      <span className="font-medium">Medical grade HEPA + heavy carbon/zeolite</span> for chemicals & odors.  
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span className="bullet" />
                    <p>
                      <span className="font-medium">Durable steel housing.</span> Made in the USA.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span className="bullet" />
                    <p>
                      <span className="font-medium">Clinically tested.</span> Trusted by hospitals, schools, and wildfire response.
                    </p>
                  </li>
                </ul>
                <p className="text-gray-700/90">
                  That&apos;s why <span className="font-semibold">Austin Air</span> goes beyond basic HEPA—combining medical-grade HEPA with heavy carbon to capture what others leave behind.
                </p>
                <a
                  href="#guide"
                  className="inline-block rounded-xl bg-[#1e40af] px-5 py-3 font-semibold text-white shadow hover:bg-[#1e3a8a] transition-colors"
                >
                  Compare models
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}



// 6) Social proof (short + credible)
type Testimonial = {
  quote: string;
  name: string;
  title?: string;
  initial: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Within two days my son said, 'I can smell again.' The difference was real.",
    name: "Rebecca",
    title: "Fresh Air Mama",
    initial: "R",
  },
  {
    quote:
      "Ran it 24/7 after a remodel—VOCs down, sleep up. Worth it.",
    name: "Verified Customer",
    title: "Homeowner",
    initial: "V",
  },
  // Add more as you collect them:
  // { quote: "...", name: "C.F.", title: "Asthma relief", initial: "C" },
];

function SocialProof() {
  return (
    <section className="py-16 bg-slate-50/60" aria-label="Customer testimonials">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1e40af] text-center mb-12">
          What families like yours say
        </h2>
        <div className="testimonial-grid">
          {TESTIMONIALS.map((t, idx) => (
            <figure
              key={idx}
              className="testimonial-card"
            >
              <blockquote className="mb-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  "{t.quote}"
                </p>
              </blockquote>
              <figcaption className="text-xs text-right">
                <span className="font-semibold text-[#1e40af]">{t.name}</span>
                {t.title ? (
                  <>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-gray-600">{t.title}</span>
                  </>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .testimonial-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          justify-content: center;
          align-items: center;
        }
        
        @media (min-width: 768px) {
          .testimonial-grid {
            flex-direction: row;
            gap: 2rem;
          }
        }
        
        .testimonial-card {
          background: white;
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #f3f4f6;
          text-align: left;
          width: 100%;
          max-width: 300px;
          transition: box-shadow 0.3s ease;
        }
        
        .testimonial-card:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        .testimonial-card figcaption {
          text-align: right !important;
        }
        
        @media (min-width: 768px) {
          .testimonial-card {
            width: 280px;
            max-width: none;
          }
        }
      `}</style>
    </section>
  );
}



function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
