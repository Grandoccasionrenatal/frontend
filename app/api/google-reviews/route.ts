import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json({ error: 'Missing configuration' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}&reviews_sort=newest`,
      { next: { revalidate: 3600 } }
    );

    const data = await res.json();

    if (data.status !== 'OK') {
      return NextResponse.json({ reviews: [] });
    }

    const reviews = (data.result?.reviews ?? []).map(
      (r: any, idx: number) => ({
        id: idx + 1,
        attributes: {
          name: r.author_name,
          review: r.text,
          rating: r.rating,
          relative_time: r.relative_time_description,
          publishedAt: new Date(r.time * 1000).toISOString(),
          updatedAt: new Date(r.time * 1000).toISOString()
        }
      })
    );

    return NextResponse.json({ reviews });
  } catch {
    return NextResponse.json({ reviews: [] });
  }
}
