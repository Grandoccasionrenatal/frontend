import blogService from '@/adapters/blog';
import Link from 'next/link';
import qs from 'qs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Event Planning Tips & Ideas | Grand Occasion Rental Limited',
  description:
    'Discover event planning tips, product spotlights, real event showcases and seasonal ideas from Grand Occasion Rental Limited — serving Kildare, Dublin, Carlow and Portlaoise.'
};

export const revalidate = 60;

const CATEGORY_LABELS: Record<string, string> = {
  'event-planning-tips': 'Event Planning Tips',
  'product-spotlight': 'Product Spotlight',
  'real-event-showcase': 'Real Event Showcase',
  'seasonal-local': 'Seasonal & Local'
};

const CATEGORY_COLOURS: Record<string, string> = {
  'event-planning-tips': 'bg-blue-100 text-blue-700',
  'product-spotlight': 'bg-orange-100 text-orange-700',
  'real-event-showcase': 'bg-green-100 text-green-700',
  'seasonal-local': 'bg-purple-100 text-purple-700'
};

export default async function BlogPage() {
  const data = await blogService.getBlogPosts(
    qs.stringify({ populate: '*', sort: ['createdAt:desc'], pagination: { pageSize: 20 } })
  );

  const posts = data?.data ?? [];

  return (
    <main className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-3">Our Blog</h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Event planning tips, product highlights and inspiration for your next occasion.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-gray-400 py-24">No posts yet — check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => {
            const { title, slug, excerpt, category, author, read_time, cover_image } =
              post.attributes;
            const imageUrl = cover_image?.data?.attributes?.url;

            return (
              <Link key={post.id} href={`/blog/${slug}`} className="group">
                <article className="h-full flex flex-col rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                  <div className="relative w-full h-48 bg-orange-50 overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-orange-1/10">
                        <span className="text-4xl">🎉</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 p-5 gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLOURS[category] ?? 'bg-gray-100 text-gray-600'}`}
                      >
                        {CATEGORY_LABELS[category] ?? category}
                      </span>
                      {read_time && (
                        <span className="text-xs text-gray-400">{read_time}</span>
                      )}
                    </div>
                    <h2 className="text-lg font-bold leading-snug group-hover:text-orange-500 transition-colors duration-200">
                      {title}
                    </h2>
                    <p className="text-sm text-gray-500 flex-1 line-clamp-3">{excerpt}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">{author ?? 'Grand Occasion Rental Limited'}</span>
                      <span className="text-sm font-semibold text-orange-500 group-hover:underline">
                        Read more →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
