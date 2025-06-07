import express, { Express } from "express";
import request from "supertest";
import createCheckoutRouter from "./checkout.route";
import { PlaceOrderFacadeInputDto } from "../../facade/checkout.facade.dto";
import CheckoutFacade from "../../facade/checkout.facade";

describe("Checkout Routes", () => {
  let app: Express;
  let mockPlaceOrder: jest.Mock;
  let mockFacade: any;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    mockPlaceOrder = jest.fn();
    mockFacade = { placeOrder: mockPlaceOrder };
    app.use(createCheckoutRouter(mockFacade));
  });

  describe("POST /checkout", () => {
    const mockCheckoutData: PlaceOrderFacadeInputDto = {
      clientId: "1",
      products: [
        {
          productId: "1",
          quantity: 1
        }
      ]
    };

    it("deve retornar 201 e os dados do pedido quando criado com sucesso", async () => {
      const mockResponse = {
        id: "1",
        invoiceId: "1",
        status: "approved",
        total: 100,
        products: mockCheckoutData.products
      };
      mockPlaceOrder.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post("/checkout")
        .send(mockCheckoutData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
      expect(mockPlaceOrder).toHaveBeenCalledWith(mockCheckoutData);
    });

    it("deve retornar 500 se o facade.placeOrder lançar erro", async () => {
      mockPlaceOrder.mockRejectedValue(new Error("Erro ao criar pedido"));
      
      const response = await request(app)
        .post("/checkout")
        .send(mockCheckoutData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao criar pedido");
    });
  });

  it("deve retornar 500 se ocorrer erro no placeOrder", async () => {
    const mockFacade = {
      placeOrder: jest.fn().mockRejectedValue(new Error("Erro simulado")),
    } as unknown as CheckoutFacade;

    const app = express();
    app.use(express.json());
    app.use(createCheckoutRouter(mockFacade));

    const response = await request(app)
      .post("/checkout")
      .send({ clientId: "1", products: [] });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "Erro simulado");
  });
}); 
