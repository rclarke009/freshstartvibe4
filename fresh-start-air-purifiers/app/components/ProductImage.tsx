import type { ProductVariantFragment } from 'storefrontapi.generated';
import { Image } from '@shopify/hydrogen';

export function ProductImage({
  image,
  className,
  loading, // Destructure loading prop
}: {
  image: ProductVariantFragment['image'];
  className?: string; // Optional className prop
  loading?: 'lazy' | 'eager'; // Add optional loading prop with valid values
}) {
  if (!image) {
    return <div className="product-image" />;
  }
  return (
    <div className={`product-image ${className || ''}`}> {/* Combine with optional className */}
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
        className={className} // Pass className to Image
        loading={loading || 'lazy'} // Use provided loading or default to 'lazy'
      />
    </div>
  );
}

export default ProductImage;

// import type {ProductVariantFragment} from 'storefrontapi.generated';
// import {Image} from '@shopify/hydrogen';

// export function ProductImage({
//   image,
// }: {
//   image: ProductVariantFragment['image'];
// }) {
//   if (!image) {
//     return <div className="product-image" />;
//   }
//   return (
//     <div className="product-image">
//       <Image
//         alt={image.altText || 'Product Image'}
//         aspectRatio="1/1"
//         data={image}
//         key={image.id}
//         sizes="(min-width: 45em) 50vw, 100vw"
//       />
//     </div>
//   );
// }
