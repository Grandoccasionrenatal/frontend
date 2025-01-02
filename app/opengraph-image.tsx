import { ImageResponse } from 'next/server';

export const runtime = 'edge';

export const alt = 'Inawo Magazine';
export const size = {
  width: 1200,
  height: 630
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'black'
        }}
      >
        <span>Grad Occasion</span>
      </div>
    ),
    {
      ...size
    }
  );
}
