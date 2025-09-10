import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {sanityClient} from '~/lib/sanityClient';
import {PortableText} from '@portabletext/react';
import {createImageUrlBuilder} from '@sanity/image-url';

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

  const metadata = [
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
          key={index}
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
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <article className="grid lg:grid-cols-12 gap-y-12">
        {/* Header */}
        <header className="lg:col-span-12 flex flex-col gap-6 items-start">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Categories categories={blog.categories} />
            <PublishedAt publishedAt={blog.publishedAt} />
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1e40af] leading-tight">
            {blog.title}
          </h1>
          
          {blog.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed max-w-4xl">
              {blog.excerpt}
            </p>
          )}
          
          <Author author={blog.author} />
        </header>

        {/* Featured Image */}
        {blog.featuredImage?.asset?.url && (
          <figure className="lg:col-span-4 flex flex-col gap-2 items-start">
            <img
              src={`${blog.featuredImage.asset.url}?w=1200&h=800&fit=crop&auto=format&q=90`}
              alt={blog.featuredImage.alt || blog.title || "Post image"}
              className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-lg"
            />
            {blog.featuredImage.alt && (
              <figcaption className="text-sm text-gray-500 italic">
                {blog.featuredImage.alt}
              </figcaption>
            )}
          </figure>
        )}

        {/* Content */}
        {blog.content && (
          <div className="lg:col-span-7 lg:col-start-6 prose prose-lg max-w-none">
            <PortableText value={blog.content} />
          </div>
        )}
      </article>
    </main>
  );
}