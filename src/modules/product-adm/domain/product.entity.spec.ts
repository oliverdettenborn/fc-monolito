import Product from "./product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("Product Entity test", () => {
  it("should create a product", () => {
    const props = {
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 100,
      stock: 10,
    };

    const product = new Product(props);

    expect(product.id).toBeDefined();
    expect(product.name).toBe(props.name);
    expect(product.description).toBe(props.description);
    expect(product.purchasePrice).toBe(props.purchasePrice);
    expect(product.stock).toBe(props.stock);
  });

  it("should create a product with id", () => {
    const id = new Id("1");
    const props = {
      id,
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 100,
      stock: 10,
    };

    const product = new Product(props);

    expect(product.id).toBe(id);
    expect(product.name).toBe(props.name);
    expect(product.description).toBe(props.description);
    expect(product.purchasePrice).toBe(props.purchasePrice);
    expect(product.stock).toBe(props.stock);
  });

  it("should update product properties", () => {
    const props = {
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 100,
      stock: 10,
    };

    const product = new Product(props);

    product.name = "Product 2";
    product.description = "Description 2";
    product.purchasePrice = 200;
    product.stock = 20;

    expect(product.name).toBe("Product 2");
    expect(product.description).toBe("Description 2");
    expect(product.purchasePrice).toBe(200);
    expect(product.stock).toBe(20);
  });
}); 
