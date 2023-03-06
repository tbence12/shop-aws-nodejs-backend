import { DBProduct, DBStock, Product, ProductId } from "src/models/productModel";

import * as AWS from 'aws-sdk';
const dynamo = new AWS.DynamoDB.DocumentClient();

const scan = async (table: string) => {
  const scanResults = await dynamo.scan({
    TableName: process.env[table]
  }).promise();
  return scanResults.Items;
}

const query = async (id: string, table: string) => {
  const queryResults = await dynamo.query({
    TableName: process.env[table],
    KeyConditionExpression: `${table === "PRODUCTS_TABLE_NAME" ? 'id = :id' : 'product_id = :id' }`,
    ExpressionAttributeValues: {':id': id}
  }).promise();
  return queryResults.Items;
}

const put = async (item: DBProduct | DBStock, table: string) => {
  return dynamo.put({
    TableName: process.env[table],
    Item: item
  }).promise();
}

const mergeProductAndStockItems = (productItems, stockItems) => {
  return productItems.map(product => {
    const stock = stockItems.find(stock => stock.product_id === product.id );
    return {...product, count: stock.count};
  });
}

export class ProductService {
   static async getProducts(): Promise<Product[]> {
    const productItems = await scan('PRODUCTS_TABLE_NAME');
    const stockItems = await scan('STOCKS_TABLE_NAME');
    
    const products = mergeProductAndStockItems(productItems, stockItems);

    return products;
  }

  static async getProductById(id: ProductId): Promise<Product> {
    const productItems = await query(id, 'PRODUCTS_TABLE_NAME');
    const stockItems = await query(id, 'STOCKS_TABLE_NAME');
    const product = mergeProductAndStockItems(productItems, stockItems);
    return product;
  }

  static async createProduct(product: Product): Promise<void> {
    const { count, ...productItem } = product;
    const stockItem = { product_id: product.id, count};
    await put(productItem, 'PRODUCTS_TABLE_NAME');
    await put(stockItem, 'STOCKS_TABLE_NAME');
  }
}
