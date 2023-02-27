import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ProductService } from 'src/services/productService';

export const getProductsList = async () => {
  try {
    const products = await ProductService.getProducts();
    return formatJSONResponse(products);
  } catch (error) {
    return formatJSONResponse(error, 500)
  }
};

export const main = middyfy(getProductsList);
