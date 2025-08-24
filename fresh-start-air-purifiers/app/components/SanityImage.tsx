interface SanityImageProps {
  asset: any;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}

export function SanityImage({ asset, alt, className, width, height }: SanityImageProps) {
  if (!asset?.url) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500">Image not available</span>
      </div>
    );
  }

  return (
    <img
      src={asset.url}
      alt={alt || 'Product image'}
      className={className}
      width={width}
      height={height}
      loading="lazy"
    />
  );
}
