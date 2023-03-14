import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productValidator } from '@libs/validator';
import { ProductService } from 'src/services/productService';

const createProduct = async (event) => {
  console.log('[createProduct] called, arguments: ', JSON.stringify(event.body));
  try {
    const validatedProduct = productValidator(event.body);
    if (validatedProduct.valid) {
      const product = validatedProduct.body;
      await ProductService.createProduct(product);
      return formatJSONResponse(product, 201);
    }
    return formatJSONResponse(`Product data invalid: ${validatedProduct.message}`, 400);
  } catch (error) {
    return formatJSONResponse(error, 500)
  }
};

export const main = middyfy(createProduct);
