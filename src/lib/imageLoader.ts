interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function customImageLoader({
  src,
}: ImageLoaderProps): string {
  return src;
}
