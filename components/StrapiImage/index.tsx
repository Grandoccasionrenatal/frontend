'use client';

import { cn } from '@/lib/utils';
import { isImageOrVideo } from '@/utils';
import { shimmer, toBase64 } from '@/utils/shimmer';
import Image from 'next/image';
import { useMemo } from 'react';
import ReactPlayer from 'react-player/lazy';

interface IStrapiImage {
  src: string;
  alt?: string;
  className?: string;
  blurDataUrl?: string;
  objectFit?: string;
}

const StrapiImage = ({ src, alt, className, blurDataUrl, objectFit }: IStrapiImage) => {
  const imageLoader = ({ src }: { src: string }) => {
    return `${src}`;
  };

  const isVideo = useMemo(() => {
    const res = isImageOrVideo(src);
    if (res === 'video') {
      return true;
    }
    return false;
  }, [src]);

  if (!src || src === 'undefined' || src === 'null') {
    return (
      <div className={cn('w-full h-full bg-slate-100 grid place-items-center', className)}>
        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return isVideo ? (
    <div className="w-full h-full overflow-hidden bg-black-1">
      <ReactPlayer playing height={'100%'} width={'100%'} url={src} loop muted />
    </div>
  ) : (
    <Image
      loader={imageLoader}
      alt={alt ?? ''}
      fill={true}
      src={src}
      placeholder={`blur`}
      objectFit={objectFit ?? 'cover'}
      objectPosition="center"
      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
      priority={false}
    />
  );
};

export default StrapiImage;
