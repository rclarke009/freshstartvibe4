import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction, Link} from '@remix-run/react';
import {sanityClient} from '~/lib/sanityClient';
import {PortableText} from '@portabletext/react';
import createImageUrlBuilder from '@sanity/image-url';
import {Suspense} from 'react';

// Create image URL builder
const urlFor = (source: any) => createImageUrlBuilder(sanityClient).image(source);

// Shared fetch function
const getPost = async (slug: string) => {
  return await sanityClient.fetch(`
    *[_type == "blog" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      content,
      featuredImage {
        asset->{url},
        alt
      },
      author->{
        name,
        image {
          asset->{url},
          alt
        }
      },
      publishedAt,
      categories[]->{
        title
      },
      seo {
        title,
        description,
        image {
          asset->{url},
          alt
        },
        noIndex
      }
    }
  `, {slug});
};

export const meta: MetaFunction<typeof loader> = ({data}) => {
  const post = data?.blog;
  
  if (!post) {
    return [
      {title: 'Post Not Found'},
      {name: 'description', content: 'This post could not be found.'}
    ];
  }

  const metadata: Array<{title?: string; name?: string; property?: string; content?: string}> = [
    {title: post.seo?.title || post.title || 'Fresh Start Air Purifiers Blog'},
    {name: 'description', content: post.seo?.description || post.excerpt || 'Read the latest insights on air purification and clean living.'}
  ];

  // Add Open Graph image if available
  if (post.seo?.image?.asset?.url) {
    const imageUrl = `${post.seo.image.asset.url}?w=1200&h=630&fit=crop&auto=format`;
    metadata.push(
      {property: 'og:image', content: imageUrl},
      {property: 'og:image:width', content: '1200'},
      {property: 'og:image:height', content: '630'},
      {property: 'og:image:alt', content: post.seo.image.alt || post.title || 'Blog Post Image'}
    );
  } else if (post.featuredImage?.asset?.url) {
    const imageUrl = `${post.featuredImage.asset.url}?w=1200&h=630&fit=crop&auto=format`;
    metadata.push(
      {property: 'og:image', content: imageUrl},
      {property: 'og:image:width', content: '1200'},
      {property: 'og:image:height', content: '630'},
      {property: 'og:image:alt', content: post.featuredImage.alt || post.title || 'Blog Post Image'}
    );
  }

  // Add noindex if specified
  if (post.seo?.noIndex) {
    metadata.push({name: 'robots', content: 'noindex'});
  }

  return metadata;
};

export async function loader({params}: LoaderFunctionArgs) {
  if (!params.slug) {
    throw new Response('Blog post not found', {status: 404});
  }

  const blog = await getPost(params.slug);

  if (!blog) {
    throw new Response('Blog post not found', {status: 404});
  }

  return {blog};
}

// Helper components
function Categories({ categories }: { categories?: Array<{ title?: string }> }) {
  if (!categories || categories.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2">
      {categories.slice(0, 3).map((category, index) => (
        <span
          key={category.title || index}
          className="inline-flex items-center rounded-full bg-[#1e40af]/10 px-3 py-1 text-xs font-medium text-[#1e40af]"
        >
          {category.title}
        </span>
      ))}
    </div>
  );
}

function PublishedAt({ publishedAt }: { publishedAt?: string }) {
  if (!publishedAt) return null;
  
  return (
    <time 
      dateTime={publishedAt}
      className="text-sm text-gray-500"
    >
      {new Date(publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </time>
  );
}

function Author({ author }: { author?: { name?: string; image?: { asset?: { url?: string }; alt?: string } } }) {
  if (!author) return null;
  
  return (
    <div className="flex items-center gap-3">
      {author.image?.asset?.url ? (
        <img
          src={author.image.asset.url}
          alt={author.image.alt || author.name || 'Author'}
          className="h-10 w-10 rounded-full object-cover"
        />
      ) : (
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#1e40af]/20 to-[#1e40af]/10 border border-slate-200 flex items-center justify-center">
          <span className="text-[#1e40af] text-sm font-semibold">FS</span>
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-gray-900">{author.name}</p>
        <p className="text-xs text-gray-500">Author</p>
      </div>
    </div>
  );
}

export default function BlogPost() {
  const {blog} = useLoaderData<typeof loader>();

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back to Blog List Button */}
      <div className="mb-8">
        <Link
          to="/blogs"
          className="text-[#1e40af] hover:text-[#1e40af]/80 transition-colors duration-200 font-medium text-sm"
        >
          ← Back to Blog List
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <header className="px-8 py-10 sm:px-12 sm:py-12">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
            <Categories categories={blog.categories} />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            {blog.title}
          </h1>
          
          
        </header>

        {/* Two Column Layout: Image + Content */}
        <div className="px-8 sm:px-12 pb-12">
          <div className="flex flex-row gap-6 items-start">
            {/* Left Column - Image (Fixed size, stacks on mobile) */}
            {blog.featuredImage?.asset?.url && (
              <div className="flex-shrink-0">
                <figure className="w-32 h-32">
                  <img
                    src={`${blog.featuredImage.asset.url}?w=300&h=300&fit=crop&auto=format&q=90`}
                    alt={blog.featuredImage.alt || blog.title || "Post image"}
                    className="w-32 h-32 object-cover rounded-lg shadow-md"
                  />
                  {blog.featuredImage.alt && (
                    <figcaption className="text-xs text-gray-500 italic mt-2 text-left">
                      {blog.featuredImage.alt}
                    </figcaption>
                  )}
                </figure>
              </div>
            )}

            {/* Right Column - Content (Responsive width) */}
            <div className="flex-1">

             



              {blog.content && (
                <Suspense fallback={<div>Loading content...</div>}>
                  <PortableText
                    value={blog.content}
                    components={{
                      types: {
                        image: ({ value }) => {
                          if (!value?.asset?.url) return null;
                          return (
                            <figure className="my-6">
                              <img
                                src={`${value.asset.url}?w=800&h=400&fit=crop&auto=format&q=90`}
                                alt={value.alt || 'Blog content image'}
                                className="w-full h-48 object-cover rounded-lg shadow-md"
                              />
                              {value.alt && (
                                <figcaption className="text-sm text-gray-500 italic mt-2 text-center">
                                  {value.alt}
                                </figcaption>
                              )}
                            </figure>
                          );
                        },
                      },
                      block: {
                        normal: ({ children }) => <p className="mb-6 leading-relaxed text-gray-700 text-lg">{children}</p>,
                        h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 text-gray-900 mt-8 first:mt-0">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 text-gray-900 mt-8 first:mt-0">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-bold mb-3 text-gray-900 mt-6 first:mt-0">{children}</h3>,
                        h4: ({ children }) => <h4 className="text-lg font-bold mb-2 text-gray-900 mt-4 first:mt-0">{children}</h4>,
                        blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-6 italic my-8 text-gray-600 bg-gray-50 py-4 rounded-r-lg">{children}</blockquote>,
                      },
                      list: {
                        bullet: ({ children }) => <ul className="list-disc list-inside mb-6 space-y-3 text-gray-700">{children}</ul>,
                        number: ({ children }) => <ol className="list-decimal list-inside mb-6 space-y-3 text-gray-700">{children}</ol>,
                      },
                      listItem: {
                        bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        number: ({ children }) => <li className="leading-relaxed">{children}</li>,
                      },
                      marks: {
                        strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                        em: ({ children }) => <em className="italic text-gray-600">{children}</em>,
                        code: ({ children }) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">{children}</code>,
                      },
                    }}
                  />
                </Suspense>
              )}
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}