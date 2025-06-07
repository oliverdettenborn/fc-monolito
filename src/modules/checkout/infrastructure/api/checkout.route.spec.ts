import express, { Express } from "express";
import request from "supertest";
import createCheckoutRouter from "./checkout.route";
import CheckoutFacadeFactory from "../../factory/checkout.facade.factory";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { setupTestDatabase, teardownTestDatabase } from "../../../../test-migrations/config-migrations/test-setup";
import { ClientModel } from "../../../client-adm/repository/client.model";
import { ProductModel } from "../../../product-adm/repository/product.model";

describe("Checkout Routes E2E", () => {
  let app: Express;
  let sequelize: Sequelize;
  let migration: Umzug<any>;
  let facade: any;

  beforeEach(async () => {
    app = express();
    app.use(express.json());

    const setup = await setupTestDatabase({
      models: [ClientModel, ProductModel],
    });
    sequelize = setup.sequelize;
    migration = setup.migration;

    facade = CheckoutFacadeFactory.create();
    app.use(createCheckoutRouter(facade));
  });

  afterEach(async () => {
    await teardownTestDatabase(sequelize, migration);
  });

  describe("POST /checkout", () => {
    it("deve criar um pedido com sucesso", async () => {
      // Primeiro cria um cliente
      const clientData = {
        name: "Cliente Teste",
        email: "cliente@teste.com",
        document: "12345678900",
        address: {
          street: "Rua Teste",
          number: "123",
          complement: "Apto 1",
          city: "Cidade Teste",
          state: "Estado Teste",
          zipCode: "12345-678"
        }
      };

      const clientResponse = await request(app)
        .post("/clients")
        .send(clientData);

      // Depois cria um produto
      const productData = {
        name: "Produto Teste",
        description: "Descrição do produto",
        purchasePrice: 100,
        stock: 10
      };

      const productResponse = await request(app)
        .post("/products")
        .send(productData);

      // Por fim, cria o pedido
      const checkoutData = {
        clientId: clientResponse.body.id,
        products: [
          {
            productId: productResponse.body.id,
            quantity: 1
          }
        ]
      };

      const response = await request(app)
        .post("/checkout")
        .send(checkoutData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        clientId: checkoutData.clientId,
        products: checkoutData.products,
        status: "approved"
      });
      expect(response.body.id).toBeDefined();
      expect(response.body.invoiceId).toBeDefined();
      expect(response.body.total).toBeDefined();
    });

    it("deve retornar erro ao tentar criar pedido sem produtos", async () => {
      const checkoutData = {
        clientId: "1",
        products: [] as any[]
      };

      const response = await request(app)
        .post("/checkout")
        .send(checkoutData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
  });
}); 
