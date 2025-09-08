import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {sanityClient} from '~/lib/sanityClient';
import {PortableText} from '@portabletext/react';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `${data?.blog?.title ?? ''} | Blog`}];
};

export async function loader({params}: LoaderFunctionArgs) {
  if (!params.slug) {
    throw new Response('Blog post not found', {status: 404});
  }

  const blog = await sanityClient.fetch(`
    *[_type == "blog" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      author,
      publishedAt,
      seo
    }
  `, {slug: params.slug});

  if (!blog) {
    throw new Response('Blog post not found', {status: 404});
  }

  return {blog};
}

export default function BlogPost() {
  const {blog} = useLoaderData<typeof loader>();

  return (
    <div className="blog-post">
      <article>
        <header>
          <h1>{blog.title}</h1>
          {blog.excerpt && <p className="excerpt">{blog.excerpt}</p>}
          <div className="meta">
            {blog.author && <span>By {blog.author}</span>}
            {blog.publishedAt && (
              <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
            )}
          </div>
        </header>
        
        {blog.featuredImage && (
          <img 
            src={blog.featuredImage.asset.url} 
            alt={blog.featuredImage.alt || blog.title}
            className="featured-image"
          />
        )}
        
        <div className="content">
          <PortableText value={blog.content} />
        </div>
      </article>
    </div>
  );
}
