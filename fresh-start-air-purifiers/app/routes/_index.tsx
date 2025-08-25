///Users/rebeccaclarke/Documents/WebFiles/CurrentWorkingDirectory/freshstartvibe4/fresh-start-air-purifiers/app/routes/_index.tsx

import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import type {
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';

export const meta: MetaFunction = () => {
  return [{title: 'Fresh Start Air Purifiers | Bring the fresh air indoors'}];
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
      {/* Content sections - Start immediately after hero (which is now in PageLayout) */}
      <div className="content-sections">
        <ProblemValidation />
        <TrustAuthority />
        <GuidedChooser />
        <MicroQuiz />
        <SocialProof />
        <FinalCTA />
        <RecommendedProducts products={data.recommendedProducts} />
      </div>
    </div>
  );
}

// 2) Problem → "you're not crazy" validation
function ProblemValidation() {
  return (
    <section className="bg-slate-50/60 rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl font-semibold text-[#1e40af]">Why the air still bothers you</h2>
      <ul className="mt-4 grid md:grid-cols-3 gap-4 text-gray-700/80">
        <li>Fragrance can drift in from other units and hallways.</li>
        <li>New finishes and foam release VOCs for months.</li>
        <li>Most purifiers trap dust, not chemicals and odors.</li>
      </ul>
    </section>
  );
}

// 3) Trust/authority ("why Austin Air" in 3 receipts)
function TrustAuthority() {
  return (
    <section className="py-10">
      <h2 className="text-2xl font-semibold text-[#1e40af]">Serious filtration for real‑world homes</h2>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <div className="p-5 border rounded-xl bg-white">Medical‑grade HEPA + heavy carbon/zeolite for chemicals & odors.</div>
        <div className="p-5 border rounded-xl bg-white">Durable steel housing. Made in the USA.</div>
        <div className="p-5 border rounded-xl bg-white">Trusted in hospitals, schools, and wildfire response.</div>
      </div>
    </section>
  );
}

// 4) Guided chooser — "Which unit is right for me?"
function GuidedChooser() {
  return (
    <section id="guide" className="py-10">
      <h2 className="text-2xl font-semibold text-[#1e40af]">Find the right Austin for your needs</h2>
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <article className="p-6 border rounded-2xl bg-white">
          <h3 className="font-semibold text-lg">HealthMate</h3>
          <p className="mt-2 text-gray-700/80">Best all‑around: dust, pollen, everyday odors—whole‑home workhorse.</p>
          <a href="/collections/healthmate" className="mt-3 inline-block text-[#1e40af] font-semibold hover:underline">Shop HealthMate →</a>
        </article>
        <article className="p-6 border rounded-2xl bg-white">
          <h3 className="font-semibold text-lg">HealthMate Plus</h3>
          <p className="mt-2 text-gray-700/80">Stronger chemical & VOC reduction (new builds, furniture off‑gassing, fragrance).</p>
          <a href="/collections/healthmate-plus" className="mt-3 inline-block text-[#1e40af] font-semibold hover:underline">Shop HM Plus →</a>
        </article>
        <article className="p-6 border rounded-2xl bg-white">
          <h3 className="font-semibold text-lg">Allergy Machine</h3>
          <p className="mt-2 text-gray-700/80">Mold, pollen, and asthma support with HEGA carbon cloth.</p>
          <a href="/collections/allergy-machine" className="mt-3 inline-block text-[#1e40af] font-semibold hover:underline">Shop Allergy Machine →</a>
        </article>
        <article className="p-6 border rounded-2xl bg-white">
          <h3 className="font-semibold text-lg">Bedroom Machine</h3>
          <p className="mt-2 text-gray-700/80">Deep nighttime protection for the most sensitive sleepers.</p>
          <a href="/collections/bedroom-machine" className="mt-3 inline-block text-[#1e40af] font-semibold hover:underline">Shop Bedroom Machine →</a>
        </article>
      </div>

      <div className="mt-6 p-5 bg-slate-50/70 rounded-xl">
        <p className="font-medium">Small room or kids' room?</p>
        <p className="text-gray-700/80">Choose the <span className="font-semibold">Junior</span> versions—same filtration, smaller footprint.</p>
      </div>
    </section>
  );
}

// 5) Micro‑quiz (keeps them engaged)
function MicroQuiz() {
  return (
    <section className="py-10">
      <h2 className="text-2xl font-semibold text-[#1e40af]">Not sure? Answer 3 quick questions</h2>
      <div className="mt-4 grid md:grid-cols-3 gap-3 text-sm">
        <label className="p-4 border rounded-xl bg-white">
          Main concern: 
          <select className="mt-2 w-full border rounded-md p-2">
            <option>Fragrance / VOCs</option>
            <option>Mold / allergies</option>
            <option>General dust & odors</option>
          </select>
        </label>
        <label className="p-4 border rounded-xl bg-white">
          Room size: 
          <select className="mt-2 w-full border rounded-md p-2">
            <option>Small (≤500 sq ft)</option>
            <option>Medium (500–1000)</option>
            <option>Large (1000–1500)</option>
          </select>
        </label>
        <label className="p-4 border rounded-xl bg-white">
          Noise priority:
          <select className="mt-2 w-full border rounded-md p-2">
            <option>As quiet as possible</option>
            <option>Balanced</option>
            <option>Max performance</option>
          </select>
        </label>
      </div>
      <a href="/collections/recommended" className="mt-4 inline-block bg-[#1e40af] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#1e3a8a] transition-colors">See my recommendation</a>
    </section>
  );
}

// 6) Social proof (short + credible)
function SocialProof() {
  return (
    <section className="py-10">
      <h2 className="text-2xl font-semibold text-[#1e40af]">What families like yours say</h2>
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <blockquote className="p-6 border rounded-2xl italic bg-white">
          "Within two days my son said, 'I can smell again.' The difference was real." — Rebecca, Fresh Air Mama
        </blockquote>
        <blockquote className="p-6 border rounded-2xl italic bg-white">
          "Ran it 24/7 after a remodel—VOCs down, sleep up. Worth it." — Verified customer
        </blockquote>
      </div>
    </section>
  );
}

// 7) Final CTA
function FinalCTA() {
  return (
    <section className="py-10 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-[#1e40af]">Ready to breathe easier?</h2>
      <p className="mt-2 text-gray-700/80">Pick your model or take the 3‑question guide.</p>
      <div className="mt-4 flex items-center justify-center gap-3">
        <a href="#guide" className="bg-[#1e40af] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#1e3a8a] transition-colors">Compare models</a>
        <a href="/collections/all" className="px-5 py-3 rounded-xl border font-semibold text-[#1e40af] border-[#1e40af] hover:bg-[#1e40af] hover:text-white transition-colors">Shop all</a>
      </div>
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
