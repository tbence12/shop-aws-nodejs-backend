import middy from '@middy/core';
import { formatJSONResponse } from '@libs/api-gateway';
import { ProductService } from 'src/services/productService';

export const getProductsList = async () => {
  console.log('[getProductsList] called');
  try {
    const products = await ProductService.getProducts();
    return formatJSONResponse(products);
  } catch (error) {
    return formatJSONResponse(error, 500)
  }
};

export const main = middy(getProductsList);
