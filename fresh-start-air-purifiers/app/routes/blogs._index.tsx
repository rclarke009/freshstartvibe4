import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {sanityClient} from '~/lib/sanityClient';

export const meta: MetaFunction = () => {
  return [
    {title: 'Fresh Start Air Purifiers | Air Purifier Blog'},
    {name: 'description', content: 'Practical guides on fragrance/VOCs, filtration, and clean-air living.'},
  ];
};

type SanityImage = {
  asset?: {url?: string};
  alt?: string;
};

type SanityAuthor =
  | string
  | {
      name?: string;
      image?: SanityImage;
    };

type Blog = {
  _id: string;
  title: string;
  slug: {current: string};
  excerpt?: string;
  featuredImage?: SanityImage;
  author?: SanityAuthor;
  categories?: {title?: string}[];
  publishedAt?: string;
};

export async function loader(args: LoaderFunctionArgs) {
  try {
    const blogs: Blog[] = await sanityClient.fetch(`
      *[_type == "blog"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        featuredImage{
          asset->{url},
          alt
        },
        author->{
          name,
          image{
            asset->{url},
            alt
          }
        },
        categories[]->{
          title
        },
        publishedAt
      }
    `);

    return {blogs};
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return {blogs: [] as Blog[]};
  }
}

function formatDate(d?: string) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'});
  } catch {
    return '';
  }
}

function getAuthorName(author?: SanityAuthor) {
  if (!author) return undefined;
  if (typeof author === 'string') return author;
  return author.name;
}

export default function Blogs() {
  const {blogs} = useLoaderData<typeof loader>();

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-navytext">Air Purifier Blog</h1>
        <p className="mt-2 text-navytext/70 max-w-2xl">
          Fresh, practical posts on VOCs, filters, and bringing the fresh air indoors.
        </p>
        <br></br>

      </header>

      {/* Blog Cards */}
      {blogs && blogs.length > 0 ? (
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-16" style={{ 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {blogs.map((b) => (
              <Link
                key={b._id}
                to={`/blogs/${b.slug?.current}`}
                prefetch="intent"
                className="
                  group block rounded-lg shadow-sm
                  hover:shadow-md hover:border-gray-300 transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-[#1e40af]/20 focus:ring-offset-2
                "
                style={{ 
                  backgroundColor: '#f5e9d7', 
                  borderRadius: '8px'
                }}
              >
                {/* Card Content */}
                <div style={{ 
                  padding: '1rem',
                  paddingTop: '1rem',
                  paddingRight: '1rem', 
                  paddingBottom: '1rem',
                  paddingLeft: '1rem'
                }}>
                  <div className="flex gap-3 sm:gap-6">
                    {/* Text Content */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-[#1e40af] transition-colors duration-200 mb-3 leading-tight">
                        {b.title}
                      </h2>
                      
                      {b.excerpt && (
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {b.excerpt}
                        </p>
                      )}
                    </div>

                    {/* Small Square Image */}
                    <div className="flex-shrink-0">
                      {b.featuredImage?.asset?.url ? (
                        <img
                          src={`${b.featuredImage.asset.url}?w=120&h=120&fit=crop&auto=format`}
                          alt={b.featuredImage.alt ?? b.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-gray-400 text-xs">No Image</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </main>
  );
}

function EmptyState() {
  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <h2 className="text-xl font-semibold text-navytext">No posts yet</h2>
      <p className="mt-2 text-navytext/70">
        Create your first post in Sanity Studio and it’ll appear here automatically.
      </p>
      <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-navytext/80">
        <span className="h-2 w-2 rounded-full bg-tealwave" />
        Connected to Sanity
      </div>
    </section>
  );
}
