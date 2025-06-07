import express, { Express } from "express";
import request from "supertest";
import createProductRouter from "./product.route";
import { AddProductFacadeInputDto } from "../../facade/product-adm.facade.dto";

describe("Product Routes", () => {
  let app: Express;
  let mockAddProduct: jest.Mock;
  let mockFacade: any;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    mockAddProduct = jest.fn();
    mockFacade = { addProduct: mockAddProduct };
    app.use(createProductRouter(mockFacade));
  });

  describe("POST /products", () => {
    const mockProductData: AddProductFacadeInputDto = {
      id: "1",
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 100,
      stock: 10
    };

    it("deve retornar 201 e os dados do produto quando criado com sucesso", async () => {
      mockAddProduct.mockResolvedValue(mockProductData);

      const response = await request(app)
        .post("/products")
        .send(mockProductData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockProductData);
      expect(mockAddProduct).toHaveBeenCalledWith(mockProductData);
    });

    it("deve retornar 500 se o facade.addProduct lançar erro", async () => {
      mockAddProduct.mockRejectedValue(new Error("Erro ao criar produto"));
      
      const response = await request(app)
        .post("/products")
        .send(mockProductData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao criar produto");
    });
  });
}); 
