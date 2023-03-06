export type ProductId = string;

export type Product = {
  description: string
  id: ProductId
  price: number
  title: string
  count: number
};

export type DBProduct = {
  description: string
  id: ProductId
  price: number
  title: string
};

export type DBStock = {
  product_id: ProductId
  count: number
};
