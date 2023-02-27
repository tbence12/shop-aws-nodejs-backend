import { productService, getProductsList } from './handler';

const mockData = [
  {
    description: "Short Product Description1",
    id: "1",
    price: 24,
    title: "ProductOne",
    count: 7
  },
  {
    description: "Short Product Description7",
    id: "2",
    price: 15,
    title: "ProductTitle",
    count: 5
  },
]

describe('getProducts', () => {
  it('should return an array of products with a status of 200', async () => {
    const getProductsSpy = jest.spyOn(productService, 'getProducts').mockResolvedValue(mockData);

    const response = await getProductsList();

    expect(getProductsSpy).toHaveBeenCalled();
    expect(JSON.parse(response.body)).toEqual(mockData);
    expect(response.statusCode).toEqual(200);
  });
});
