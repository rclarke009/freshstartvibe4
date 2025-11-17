import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';

type BlackFridayProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage: {
    id: string;
    altText?: string | null;
    url: string;
    width?: number | null;
    height?: number | null;
  } | null;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  selectedOrFirstAvailableVariant: {
    id: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    compareAtPrice: {
      amount: string;
      currencyCode: string;
    } | null;
  } | null;
};

export function BlackFridayProductItem({
  product,
}: {
  product: BlackFridayProduct;
}) {
  const {open} = useAside();
  const image = product.featuredImage;
  const variant = product.selectedOrFirstAvailableVariant;
  const hasSale = variant?.compareAtPrice != null;

  return (
    <div className="black-friday-product-item">
      <Link
        className="black-friday-product-link"
        prefetch="intent"
        to={`/products/${product.handle}`}
      >
        {image && (
          <div className="black-friday-product-image">
            <Image
              alt={image.altText || product.title}
              aspectRatio="1/1"
              data={image}
              loading="lazy"
              sizes="(min-width: 45em) 250px, 100vw"
            />
          </div>
        )}
        <h4 className="black-friday-product-title">{product.title}</h4>
        <div className="black-friday-product-price">
          {hasSale && variant?.compareAtPrice ? (
            <div className="product-price-on-sale">
              <Money data={variant.price} />
              <s>
                <Money data={variant.compareAtPrice} />
              </s>
            </div>
          ) : variant ? (
            <Money data={variant.price} />
          ) : (
            <Money data={product.priceRange.minVariantPrice} />
          )}
        </div>
      </Link>
      {variant && (
        <div className="black-friday-product-actions">
          <AddToCartButton
            disabled={!variant}
            onClick={() => {
              open('cart');
            }}
            lines={[
              {
                merchandiseId: variant.id,
                quantity: 1,
              },
            ]}
          >
            Add to cart
          </AddToCartButton>
        </div>
      )}
    </div>
  );
}

