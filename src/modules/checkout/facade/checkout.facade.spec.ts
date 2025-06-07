import CheckoutFacade from "./checkout.facade";
import { PlaceOrderFacadeInputDto } from "./checkout.facade.dto";

describe("Checkout Facade test", () => {
  it("should place an order", async () => {
    const facade = new CheckoutFacade();

    const input: PlaceOrderFacadeInputDto = {
      clientId: "1",
      products: [
        {
          productId: "1",
          quantity: 1,
        },
        {
          productId: "2",
          quantity: 2,
        },
      ],
    };

    const result = await facade.placeOrder(input);

    expect(result.id).toBeDefined();
    expect(result.invoiceId).toBeDefined();
    expect(result.status).toBe("approved");
    expect(result.total).toBe(100);
    expect(result.products).toHaveLength(2);
    expect(result.products).toEqual(input.products);
  });
}); 
