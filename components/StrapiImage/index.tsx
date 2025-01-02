'use client';

import { cn } from '@/lib/utils';
import { isImageOrVideo } from '@/utils';
import { shimmer, toBase64 } from '@/utils/shimmer';
import Image from 'next/image';
import { useMemo } from 'react';
import ReactPlayer from 'react-player/lazy';

interface IStrapiImage {
  src: string;
  className?: string;
  blurDataUrl?: string;
  objectFit?: string;
}

const StrapiImage = ({ src, className, blurDataUrl, objectFit }: IStrapiImage) => {
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

  return isVideo ? (
    <div className="w-full h-full overflow-hidden bg-black-1">
      <ReactPlayer playing height={'100%'} width={'100%'} url={src} loop muted />
    </div>
  ) : (
    <Image
      loader={imageLoader}
      alt=""
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
