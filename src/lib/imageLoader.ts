interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function customImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  return src;
}
