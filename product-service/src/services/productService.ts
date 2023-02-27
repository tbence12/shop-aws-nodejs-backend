import { products } from "src/mocks/data";
import { Product, ProductId } from "src/models/productModel";

export class ProductService {
   static async getProducts(): Promise<Product[]> {
    return products;
  }

  static async getProductById(id: ProductId): Promise<Product> {
    const product = products.find(product => product.id === id);
    return product;
  }
}
