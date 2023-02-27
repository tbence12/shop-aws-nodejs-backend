type ProductId = string;

type Product = {
  description: string
  id: ProductId
  price: number
  title: string
  count: number
};

export { Product, ProductId };
