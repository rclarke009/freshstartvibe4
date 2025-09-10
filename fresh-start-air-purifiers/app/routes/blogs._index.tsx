import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {sanityClient} from '~/lib/sanityClient';

export const meta: MetaFunction = () => {
  return [
    {title: 'Fresh Start Air Purifiers | Blog'},
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
        <h1 className="text-3xl md:text-4xl font-semibold text-navytext">Blog</h1>
        <p className="mt-2 text-navytext/70 max-w-2xl">
          Fresh, practical posts on VOCs, filters, and making your home’s air feel… actually fresh.
        </p>
        <br></br>
      </header>

      {/* Grid */}
      {blogs && blogs.length > 0 ? (
        <ul
          className="
            grid gap-8 sm:gap-10
            sm:grid-cols-2 lg:grid-cols-3
          "
        >
          {blogs.map((b) => (
            <li key={b._id}>
              <Link
                to={`/blogs/${b.slug?.current}`}
                prefetch="intent"
                className="
                  group block overflow-hidden rounded-3xl border border-slate-200 bg-white
                  hover:shadow-2xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-[#1e40af]/60 focus:ring-offset-2
                  shadow-lg
                "
              >
                {/* Image */}
                <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
                  {b.featuredImage?.asset?.url ? (
                    <img
                      src={`${b.featuredImage.asset.url}?w=400&h=225&fit=crop&auto=format`}
                      alt={b.featuredImage.alt ?? b.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <div className="text-slate-400 text-sm font-medium">No Image</div>
                    </div>
                  )}

                  {/* Category pills */}
                  {b.categories && b.categories.length > 0 && (
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      {b.categories.slice(0, 2).map((c, idx) => (
                        <span
                          key={c?.title || idx}
                          className="rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#1e40af] shadow-lg backdrop-blur border border-white/30"
                        >
                          {c?.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-[#1e40af] group-hover:text-[#1e40af]/80 transition-colors duration-200 leading-tight">
                    {b.title}
                  </h2>

                  {b.excerpt && (
                    <p className="mt-4 line-clamp-3 text-base text-gray-600 leading-relaxed">{b.excerpt}</p>
                  )}

                  {/* Meta */}
                  <div className="mt-6 flex items-center gap-4">
                    {/* Author avatar */}
                    {'author' in b && typeof b.author !== 'string' && b.author?.image?.asset?.url ? (
                      <img
                        src={b.author.image.asset.url}
                        alt={b.author.image.alt ?? getAuthorName(b.author) ?? 'Author'}
                        className="h-10 w-10 rounded-full object-cover border-2 border-slate-200 shadow-sm"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#1e40af]/20 to-[#1e40af]/10 border-2 border-slate-200 flex items-center justify-center shadow-sm">
                        <span className="text-[#1e40af] text-sm font-bold">FS</span>
                      </div>
                    )}

                    <div className="text-sm text-gray-500">
                      <div className="font-semibold text-gray-800">
                        {getAuthorName(b.author) ?? 'Fresh Start Team'}
                      </div>
                      <div className="text-xs">{formatDate(b.publishedAt)}</div>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
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
