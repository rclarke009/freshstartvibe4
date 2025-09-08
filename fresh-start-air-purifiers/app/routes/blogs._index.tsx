import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {sanityClient} from '~/lib/sanityClient';

export const meta: MetaFunction = () => {
  return [{title: `Hydrogen | Blogs`}];
};

export async function loader(args: LoaderFunctionArgs) {
  console.log('Blog loader called');
  
  try {
    const blogs = await sanityClient.fetch(`
      *[_type == "blog"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        featuredImage,
        author,
        publishedAt
      }
    `);

    console.log('Blogs fetched:', blogs);
    return {blogs};
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return {blogs: []};
  }
}

export default function Blogs() {
  const {blogs} = useLoaderData<typeof loader>();
  
  console.log('Blogs component rendered with:', blogs);

  return (
    <div className="blogs">
      <h1>Blog</h1>
      <p>Blog route is working!</p>
      <div className="blogs-grid">
        {blogs && blogs.length > 0 ? (
          blogs.map((blog: any) => (
            <Link
              className="blog"
              key={blog._id}
              prefetch="intent"
              to={`/blogs/${blog.slug.current}`}
            >
              <h2>{blog.title}</h2>
              {blog.excerpt && <p>{blog.excerpt}</p>}
              {blog.author && <p>By {blog.author}</p>}
              {blog.publishedAt && (
                <p>{new Date(blog.publishedAt).toLocaleDateString()}</p>
              )}
            </Link>
          ))
        ) : (
          <p>No blog posts found. Create some blog posts in the Sanity studio!</p>
        )}
      </div>
    </div>
  );
}
