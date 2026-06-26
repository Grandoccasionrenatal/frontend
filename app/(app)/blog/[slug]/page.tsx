import blogService from '@/adapters/blog';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

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

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await blogService.getBlogPost(params.slug);
  const post = data?.data?.[0];
  if (!post) return {};
  return {
    title: `${post.attributes.title} | Grand Occasion Rental Limited Blog`,
    description: post.attributes.excerpt
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const data = await blogService.getBlogPost(params.slug);
  const post = data?.data?.[0];

  if (!post) notFound();

  const { title, excerpt, content, category, author, read_time, cover_image } = post.attributes;
  const imageUrl = cover_image?.data?.attributes?.url;

  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/blog" className="text-sm text-gray-400 hover:text-orange-500 transition-colors mb-8 inline-block">
        ← Back to Blog
      </Link>

      <article>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLOURS[category] ?? 'bg-gray-100 text-gray-600'}`}
            >
              {CATEGORY_LABELS[category] ?? category}
            </span>
            {read_time && <span className="text-xs text-gray-400">{read_time}</span>}
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">{title}</h1>
          <p className="text-lg text-gray-500 mb-4">{excerpt}</p>
          <p className="text-sm text-gray-400">By {author ?? 'Grand Occasion Rental Limited'}</p>
        </div>

        {/* Cover image */}
        {imageUrl && (
          <div className="w-full h-72 rounded-2xl overflow-hidden mb-10">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-orange-500 prose-strong:text-black"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>

      {/* CTA */}
      <div className="mt-16 p-8 bg-orange-50 rounded-2xl text-center">
        <h3 className="text-2xl font-bold mb-2">Ready to make your event grand?</h3>
        <p className="text-gray-500 mb-6">
          Browse our full range of hire items — delivered across Kildare, Dublin, Carlow & Portlaoise.
        </p>
        <Link href="/products">
          <button className="px-6 py-3 bg-orange-500 text-white rounded-full font-semibold hover:opacity-90 transition-opacity">
            Browse Products
          </button>
        </Link>
      </div>
    </main>
  );
}
