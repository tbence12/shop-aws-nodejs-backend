import middy from '@middy/core';
import { productValidator } from '@libs/validator';
import { ProductService } from 'src/services/productService';

const catalogBatchProcess = async (event) => {
  console.log('[catalogBatchProcess] called, arguments: ', JSON.stringify(event.Records));

  try {
    for (const record of event.Records) {
      const validatedProduct = productValidator(JSON.parse(record.body));

      if (!validatedProduct.valid) {
          console.log(`Product data invalid: ${validatedProduct.message}`);
          return;
      }

      const product = validatedProduct.body;
      product.count = +product.count;
      await ProductService.createProduct(product);
      await ProductService.sendProductCreationNotifications(product);
    }
  } catch (error) {
      console.log(error);
  }
};

export const main = middy(catalogBatchProcess);
