import type { Product } from '../types/product';

export const getFinalPrice = (product: Product): number => {
  let finalPrice = product.price;
  if (product.salePrice && product.salePrice > 0) {
    finalPrice = product.salePrice;
  } else if (product.discount && product.discount > 0) {
    finalPrice = product.price - (product.price * (product.discount / 100));
  }
  return Math.round(finalPrice);
};
