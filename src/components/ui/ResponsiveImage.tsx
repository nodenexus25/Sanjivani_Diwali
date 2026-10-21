import { ImagePlaceholder } from './ImagePlaceholder';
import { cx } from '@/lib/cx';

interface ResponsiveImageProps {
  /** Omitted until the client supplies the asset → falls back to a placeholder. */
  src?: string;
  /** Modern-format sources from vite-imagetools, e.g. AVIF and WebP. */
  sources?: { srcSet: string; type: string }[];
  srcSet?: string;
  sizes?: string;
  alt: string;
  width: number;
  height: number;
  /** Aspect ratio box, e.g. "16/10". */
  ratio?: string;
  radius?: string;
  tone?: 'dark' | 'light';
  /** Description of the missing shot, shown inside the placeholder. */
  label: string;
  /** LCP images skip lazy loading. */
  priority?: boolean;
  className?: string;
}

export function ResponsiveImage({
  src,
  sources,
  srcSet,
  sizes = '100vw',
  alt,
  width,
  height,
  ratio,
  radius = '4px',
  tone = 'light',
  label,
  priority = false,
  className,
}: ResponsiveImageProps) {
  if (!src) {
    return (
      <ImagePlaceholder
        tone={tone}
        ratio={ratio ?? `${width}/${height}`}
        label={label}
        radius={radius}
        className={className}
      />
    );
  }

  const img = (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      decoding="async"
      loading={priority ? 'eager' : 'lazy'}
      fetchpriority={priority ? 'high' : 'auto'}
      className={cx('h-full w-full object-cover', className)}
      style={radius ? { borderRadius: radius } : undefined}
    />
  );

  if (!sources?.length) return img;

  return (
    <picture>
      {sources.map((source) => (
        <source key={source.type} type={source.type} srcSet={source.srcSet} sizes={sizes} />
      ))}
      {img}
    </picture>
  );
}
