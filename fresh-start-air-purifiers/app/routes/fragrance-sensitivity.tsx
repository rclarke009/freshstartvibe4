import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';

const SYMPTOMS = [
  'Headaches or dizziness after exposure',
  'Brain fog, fatigue, or difficulty concentrating',
  'Coughing, sore throat, or shortness of breath',
  'Skin irritation or burning eyes',
  'Rapid heartbeat or anxiety-like reactions',
];

const RESOURCE_LINKS = [
  {
    label: 'Why Air Purifiers?',
    to: '/pages/why-air-purifiers',
    description: 'Dive deeper into how filtration supports healthier indoor air.',
  },
  {
    label: 'Fragrance-Free Living Tips',
    to: '/blogs',
    description: 'Read strategies for reducing everyday fragrance exposure.',
  },
  {
    label: 'Contact Us',
    to: '/contact',
    description: 'Have questions? Reach out — we understand what you’re going through.',
  },
];

export const meta: MetaFunction<typeof loader> = ({data, location}) => {
  const origin = data?.origin || 'https://freshstartairpurifiers.com';
  const pageUrl = `${origin}${location.pathname}`;
  const pageImage = `${origin}/fresh-start-air-purifiers-logo-no-bkgd.png`;
  const title = 'Learn About Fragrance Sensitivity | Fresh Start Air Purifiers';
  const description =
    'Learn why fragrance sensitivity causes real physical symptoms, how VOCs impact indoor air, and how medical-grade Austin Air purifiers provide relief.';

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

export function links() {
  return [
    {
      rel: 'canonical',
      href: 'https://freshstartairpurifiers.com/fragrance-sensitivity',
    },
  ];
}

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  return {
    origin: url.origin,
  };
}

export default function FragranceSensitivityPage() {
  const data = useLoaderData<typeof loader>();
  const origin = data?.origin || 'https://freshstartairpurifiers.com';
  const pageUrl = `${origin}/fragrance-sensitivity`;

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: "Fragrance Sensitivity Isn't in Your Head — It's in the Air",
    description:
      'Learn why fragrance sensitivity causes real physical symptoms, how VOCs impact indoor air, and how medical-grade Austin Air purifiers provide relief.',
    image: `${origin}/fresh-start-air-purifiers-logo-no-bkgd.png`,
    author: {
      '@type': 'Organization',
      name: 'Fresh Start Air Purifiers',
      url: origin,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Fresh Start Air Purifiers',
      logo: {
        '@type': 'ImageObject',
        url: `${origin}/fresh-start-air-purifiers-logo-no-bkgd.png`,
      },
    },
    datePublished: '2025-11-01',
    dateModified: '2025-11-07',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    about: {
      '@type': 'Thing',
      name: 'Fragrance Sensitivity',
      description:
        'A physiological reaction to chemicals in fragrances, perfumes, and scented products that can cause headaches, breathing difficulties, and other symptoms.',
    },
  };

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}
      />
      <HeroSection />
      <main className="max-w-5xl mx-auto px-6 md:px-8 lg:px-12 py-16 space-y-20">
        <section aria-labelledby="what-is-fragrance-sensitivity" className="space-y-6">
          <header className="space-y-4">
            <h2
              id="what-is-fragrance-sensitivity"
              className="text-3xl md:text-4xl font-bold text-[#1e40af]"
            >
              What Is Fragrance Sensitivity?
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Fragrance sensitivity is a physiological reaction to the chemicals released by
              perfumes, cleaning products, air fresheners, and fragranced personal care items. These
              reactions are not traditional allergies; they are responses to volatile organic
              compounds (VOCs) and other irritants that can overwhelm the respiratory and nervous
              systems.
            </p>
          </header>
          <p className="text-lg text-gray-700 leading-relaxed">
            You may have heard it described as Multiple Chemical Sensitivity (MCS), Chemical
            Intolerance, or Environmental Sensitivity. Regardless of the name, the experience is the
            same: everyday environments can trigger symptoms that make it hard to breathe, focus, or
            feel at ease.
          </p>
        </section>

        <section aria-labelledby="fragrance-sensitivity-symptoms" className="space-y-6">
          <header className="space-y-4">
            <h2
              id="fragrance-sensitivity-symptoms"
              className="text-3xl md:text-4xl font-bold text-[#1e40af]"
            >
              Common Symptoms
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Everyone’s threshold is different, yet the symptoms tend to follow familiar patterns.
              If you recognize the experiences below, you are not alone.
            </p>
          </header>
          <ul className="grid gap-4 md:grid-cols-2">
            {SYMPTOMS.map((symptom) => (
              <li
                key={symptom}
                className="symptom-item rounded-xl px-5 py-4 text-base text-gray-800 shadow-sm"
              >
                {symptom}
              </li>
            ))}
          </ul>
          <p className="text-lg text-gray-700 leading-relaxed">
            If you’ve ever felt sick around perfumes, detergents, or air fresheners, you’re not
            imagining it — your body is reacting to airborne chemicals it can’t filter fast enough.
          </p>
        </section>

        <section aria-labelledby="why-scents-trigger-reactions" className="space-y-6">
          <header className="space-y-4">
            <h2
              id="why-scents-trigger-reactions"
              className="text-3xl md:text-4xl font-bold text-[#1e40af]"
            >
              Why Scents Trigger Reactions
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Synthetic fragrances release VOCs and semi-volatile chemicals into the air. These
              compounds drift off candles, cleaning sprays, paints, plastics, and personal products —
              then linger in closed spaces.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <p className="text-base text-gray-700 leading-relaxed">
                VOCs can attach to soft surfaces, recycle through HVAC systems, and accumulate in
                household dust. Once inhaled, they irritate mucous membranes, tax the liver, and can
                set off oxidative stress or inflammation — particularly in sensitive individuals.
              </p>
              <p className="text-base text-gray-700 leading-relaxed">
                Research shows fragrance VOCs can react with indoor ozone to produce formaldehyde and
                ultrafine particles. That reaction creates even smaller irritants that bypass basic
                filtration and dive deep into the lungs.
              </p>
            </div>
            <aside className="rounded-2xl bg-[#F0F8FF] p-6 shadow-md border border-[#c7ddff]">
              <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                The Science in Plain Language
              </h3>
              <p className="text-base text-gray-700 leading-relaxed">
                When VOC molecules meet ozone — a common indoor pollutant tracked in from outside —
                they transform into new chemicals. Some of those byproducts, like formaldehyde, are
                known respiratory irritants that can accumulate if not removed.
              </p>
            </aside>
          </div>
        </section>

        <section aria-labelledby="why-basic-filters-fail" className="space-y-6">
          <header className="space-y-4">
            <h2
              id="why-basic-filters-fail"
              className="text-3xl md:text-4xl font-bold text-[#1e40af]"
            >
              Why Basic Air Purifiers Often Fail
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Conventional HEPA purifiers are excellent at trapping dust, pollen, and pet dander —
              but gases and fragrances slip straight through.
            </p>
          </header>
          <div className="space-y-4">
            <p className="text-base text-gray-700 leading-relaxed">
              HEPA filters are designed to collect solid particles. VOCs, odors, and many chemical
              compounds are gaseous, meaning they bypass those fibers. That’s why a standard purifier
              may run all day while the scent still hangs in the room.
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              Activated carbon — especially in large volumes — adsorbs gases and VOC molecules. This
              technology is the reason hospital-grade machines are used in medical settings,
              wildfire response, and clinical studies focused on chemical sensitivity.
            </p>
          </div>
        </section>

        <section aria-labelledby="fresh-start-solution" className="space-y-6">
          <header className="space-y-4 text-center">
            <h2
              id="fresh-start-solution"
              className="text-3xl md:text-4xl font-bold text-[#1e40af]"
            >
              Relief Begins with Clean, Chemical-Free Air.
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Austin Air’s medical-grade HEPA plus carbon and zeolite filtration captures both
              particulate matter and the VOCs that trigger fragrance sensitivity. It’s the same
              technology trusted by allergy specialists, schools, and fragrance-sensitive families who
              need consistent, reliable protection.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-[2fr,1fr] items-center">
            <div className="space-y-4">
              <p className="text-base text-gray-700 leading-relaxed">
                Each purifier uses 15 pounds of activated carbon and zeolite to absorb chemical
                vapors, paired with a true medical-grade HEPA filter. Together, they provide relief
                from both airborne particles and the chemical triggers that standard purifiers miss.
              </p>
              <p className="text-base text-gray-700 leading-relaxed">
                Families tell us the difference is immediate: fewer headaches, gentler breathing, and
                a home that finally smells like nothing at all. That’s the power of pairing science
                with compassion.
              </p>
              <br></br>
              <div className="flex flex-col sm:flex-row gap-4">
                <br></br>
                <Link to="/choose-your-purifier" className="add-to-cart-button inline-block">
                  Find Your Air Purifier
                </Link>
                <Link to="/collections" className="add-to-cart-button secondary inline-block">
                  Shop Austin Air Purifiers
                </Link>
              </div>
            </div>
            <aside className="rounded-2xl border border-slate-200 bg-[#F0F8FF] p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-[#1e40af] mb-3">
                From One Sensitive Family to Another
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                &ldquo;Within two days my son said, &lsquo;I can smell again.&rsquo; The difference was real.&rdquo;
              </p>
              <p className="mt-2 text-sm font-medium text-gray-900">Rebecca — Fresh Air Mama</p>
            </aside>
          </div>
        </section>

        <section aria-labelledby="resources" className="space-y-6">
          <header className="space-y-4">
            <h2 id="resources" className="text-3xl md:text-4xl font-bold text-[#1e40af]">
              Additional Support &amp; Resources
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Keep learning, connect with our team, and take small steps toward a fragrance-safe home.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {RESOURCE_LINKS.map((resource) => (
              <div
                key={resource.label}
                className="resource-card rounded-2xl p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-[#1e40af] mb-2">{resource.label}</h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">{resource.description}</p>
                <Link to={resource.to} className="text-[#1e40af] font-medium hover:underline">
                  Explore
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="hero-bleed hero-bg-light-blue" aria-labelledby="fragrance-hero-heading">
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 py-20 text-center space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-[#1e3a8a]">
          Learn About Fragrance Sensitivity
        </p>
        <h1
          id="fragrance-hero-heading"
          className="text-4xl md:text-5xl font-bold text-[#1e40af] leading-tight"
        >
          Fragrance Sensitivity Isn’t in Your Head — It’s in the Air.
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 dark:text-[#1e40af] max-w-3xl mx-auto leading-relaxed">
          Understand why synthetic scents can trigger real physical symptoms — and how the right
          filtration can bring relief.
        </p>
        <br></br>
        <div className="flex justify-center">
          <Link to="/choose-your-purifier" className="add-to-cart-button">
            Find Your Air Purifier
          </Link>
        </div>
      </div>
    </section>
  );
}

