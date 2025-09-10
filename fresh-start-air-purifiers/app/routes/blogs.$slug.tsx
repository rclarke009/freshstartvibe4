import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {sanityClient} from '~/lib/sanityClient';
import {PortableText} from '@portabletext/react';

// Get projectId and dataset from client config
const {projectId, dataset} = sanityClient.config();

// Manual URL builder function without external dependencies
function urlForImage(source: any) {
  if (!source?.asset?._ref) {
    return '';
  }
  const _ref = source.asset._ref;
  const parts = _ref.split('-');
  if (parts[0] !== 'image' || parts.length < 4) {
    return ''; // Invalid ref
  }
  const id = parts[1];
  const format = parts[parts.length - 1];
  let baseUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.${format}`;
  return baseUrl;
}

// Shared fetch function
const getPost = async (slug: string) => {
  return await sanityClient.fetch(`
    *[_type == "blog" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      content,
      publishedAt,
      author-> {
        name,
        image {
          asset->{url},
          alt
        }
      },
      featuredImage {
        asset->{url},
        alt
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
  let ogImageUrl = '';
  if (post.seo?.image?.asset?.url) {
    ogImageUrl = `${post.seo.image.asset.url}?w=1200&h=630&fit=crop&auto=format`;
  } else if (post.featuredImage?.asset?.url) {
    ogImageUrl = `${post.featuredImage.asset.url}?w=1200&h=630&fit=crop&auto=format`;
  }
  if (ogImageUrl) {
    metadata.push(
      {property: 'og:image', content: ogImageUrl},
      {property: 'og:image:width', content: '1200'},
      {property: 'og:image:height', content: '630'},
      {property: 'og:image:alt', content: post.seo?.image?.alt || post.featuredImage?.alt || post.title || 'Blog Post Image'}
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

export default function BlogPost() {
  const {blog} = useLoaderData<typeof loader>();

  // Custom components for PortableText to handle inline images
  const portableTextComponents = {
    types: {
      image: ({value}: {value: any}) => {
        const baseUrl = urlForImage(value);
        if (!baseUrl) {
          return null;
        }
        const imageUrl = `${baseUrl}?w=800&fit=max&auto=format`;
        return (
          <img
            src={imageUrl}
            alt={value.alt || 'Blog image'}
            loading="lazy"
            className="w-full my-4 rounded-lg shadow-md"
          />
        );
      },
      // Add other custom types as needed (e.g., for code blocks or embeds)
    },
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <article className="prose prose-lg max-w-none">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1e40af] mb-2">
            {blog.title}
          </h1>
          
          {blog.publishedAt && (
            <p className="text-sm text-gray-500 mb-4">
              {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
          
          {blog.excerpt && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {blog.excerpt}
            </p>
          )}
          {/* Meta information */}
          <div className="flex items-center gap-4 text-sm text-gray-500 border-b border-gray-200 pb-6">
            {blog.author && (
              <div className="flex items-center gap-2">
                {blog.author.image?.asset?.url ? (
                  <img
                    src={blog.author.image.asset.url}
                    alt={blog.author.image.alt || blog.author.name || 'Author'}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#1e40af]/20 to-[#1e40af]/10 border border-slate-200 flex items-center justify-center">
                    <span className="text-[#1e40af] text-xs font-semibold">FS</span>
                  </div>
                )}
                <span className="font-medium text-gray-700">
                  {blog.author.name}
                </span>
              </div>
            )}
          </div>
        </header>
        {/* Featured Image */}
        {blog.featuredImage?.asset?.url && (
          <div className="mb-8">
            <img
              src={`${blog.featuredImage.asset.url}?w=800&h=400&fit=crop&auto=format`}
              alt={blog.featuredImage.alt || blog.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}
        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <PortableText value={blog.content} components={portableTextComponents} />
        </div>
      </article>
    </main>
  );
}


// import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
// import {useLoaderData, type MetaFunction} from '@remix-run/react';
// import {sanityClient} from '~/lib/sanityClient';
// import {PortableText} from '@portabletext/react';

// // Shared fetch function
// const getPost = async (slug: string) => {
//   return await sanityClient.fetch(`
//     *[_type == "blog" && slug.current == $slug][0] {
//       _id,
//       title,
//       slug,
//       excerpt,
//       content,
//       featuredImage {
//         asset->{url},
//         alt
//       },
//       seo {
//         title,
//         description,
//         image {
//           asset->{url},
//           alt
//         },
//         noIndex
//       }
//     }
//   `, {slug});
// };

// export const meta: MetaFunction<typeof loader> = ({data}) => {
//   const post = data?.blog;
  
//   if (!post) {
//     return [
//       {title: 'Post Not Found'},
//       {name: 'description', content: 'This post could not be found.'}
//     ];
//   }

//   const metadata = [
//     {title: post.seo?.title || post.title || 'Fresh Start Air Purifiers Blog'},
//     {name: 'description', content: post.seo?.description || post.excerpt || 'Read the latest insights on air purification and clean living.'}
//   ];

//   // Add Open Graph image if available
//   if (post.seo?.image?.asset?.url) {
//     const imageUrl = `${post.seo.image.asset.url}?w=1200&h=630&fit=crop&auto=format`;
//     metadata.push(
//       {property: 'og:image', content: imageUrl},
//       {property: 'og:image:width', content: '1200'},
//       {property: 'og:image:height', content: '630'},
//       {property: 'og:image:alt', content: post.seo.image.alt || post.title || 'Blog Post Image'}
//     );
//   } else if (post.featuredImage?.asset?.url) {
//     const imageUrl = `${post.featuredImage.asset.url}?w=1200&h=630&fit=crop&auto=format`;
//     metadata.push(
//       {property: 'og:image', content: imageUrl},
//       {property: 'og:image:width', content: '1200'},
//       {property: 'og:image:height', content: '630'},
//       {property: 'og:image:alt', content: post.featuredImage.alt || post.title || 'Blog Post Image'}
//     );
//   }

//   // Add noindex if specified
//   if (post.seo?.noIndex) {
//     metadata.push({name: 'robots', content: 'noindex'});
//   }

//   return metadata;
// };

// export async function loader({params}: LoaderFunctionArgs) {
//   if (!params.slug) {
//     throw new Response('Blog post not found', {status: 404});
//   }

//   const blog = await getPost(params.slug);

//   if (!blog) {
//     throw new Response('Blog post not found', {status: 404});
//   }

//   return {blog};
// }

// export default function BlogPost() {
//   const {blog} = useLoaderData<typeof loader>();

//   return (
//     <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
//       <article className="prose prose-lg max-w-none">
//         {/* Header */}
//         <header className="mb-8">
//           <h1 className="text-3xl md:text-4xl font-bold text-[#1e40af] mb-4">
//             {blog.title}
//           </h1>
          
//           {blog.excerpt && (
//             <p className="text-xl text-gray-600 mb-6 leading-relaxed">
//               {blog.excerpt}
//             </p>
//           )}
          
//           {/* Meta information */}
//           <div className="flex items-center gap-4 text-sm text-gray-500 border-b border-gray-200 pb-6">
//             {blog.author && (
//               <div className="flex items-center gap-2">
//                 {typeof blog.author === 'object' && blog.author.image?.asset?.url ? (
//                   <img
//                     src={blog.author.image.asset.url}
//                     alt={blog.author.image.alt || blog.author.name || 'Author'}
//                     className="h-8 w-8 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#1e40af]/20 to-[#1e40af]/10 border border-slate-200 flex items-center justify-center">
//                     <span className="text-[#1e40af] text-xs font-semibold">FS</span>
//                   </div>
//                 )}
//                 <span className="font-medium text-gray-700">
//                   {typeof blog.author === 'object' ? blog.author.name : blog.author}
//                 </span>
//               </div>
//             )}
            
//             {blog.publishedAt && (
//               <time dateTime={blog.publishedAt} className="text-gray-500">
//                 {new Date(blog.publishedAt).toLocaleDateString('en-US', {
//                   year: 'numeric',
//                   month: 'long',
//                   day: 'numeric'
//                 })}
//               </time>
//             )}
//           </div>
//         </header>
        
//         {/* Featured Image */}
//         {blog.featuredImage?.asset?.url && (
//           <div className="mb-8">
//             <img 
//               src={`${blog.featuredImage.asset.url}?w=800&h=400&fit=crop&auto=format`}
//               alt={blog.featuredImage.alt || blog.title}
//               className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
//             />
//           </div>
//         )}
        
//         {/* Content */}
//         <div className="prose prose-lg max-w-none">
//           <PortableText value={blog.content} />
//         </div>
//       </article>
//     </main>
//   );
// }
