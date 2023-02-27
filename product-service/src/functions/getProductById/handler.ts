import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ProductService } from 'src/services/productService';

const getProductById = async (event) => {
  const { productId } = event.pathParameters;
  try {
    const product = await ProductService.getProductById(productId);
    if (product) {
      return formatJSONResponse(product);
    }
    return formatJSONResponse(`Product not found with this id: ${productId}`, 404);
  } catch (error) {
    return formatJSONResponse(error, 500)
  }
};

export const main = middyfy(getProductById);
