import express, { Express } from "express";
import request from "supertest";
import createProductRouter from "./product.route";
import ProductAdmFacadeFactory from "../../factory/facade.factory";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { setupTestDatabase, teardownTestDatabase } from "../../../../test-migrations/config-migrations/test-setup";
import { ProductModel } from "../../repository/product.model";

describe("Product Routes E2E", () => {
  let app: Express;
  let sequelize: Sequelize;
  let migration: Umzug<any>;
  let facade: any;

  beforeEach(async () => {
    app = express();
    app.use(express.json());

    const setup = await setupTestDatabase({
      models: [ProductModel],
    });
    sequelize = setup.sequelize;
    migration = setup.migration;

    facade = ProductAdmFacadeFactory.create();
    app.use(createProductRouter(facade));
  });

  afterEach(async () => {
    await teardownTestDatabase(sequelize, migration);
  });

  describe("POST /products", () => {
    it("deve criar um produto com sucesso", async () => {
      const productData = {
        name: "Produto Teste",
        description: "Descrição do produto",
        purchasePrice: 100,
        stock: 10
      };

      const response = await request(app)
        .post("/products")
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        name: productData.name,
        description: productData.description,
        purchasePrice: productData.purchasePrice,
        stock: productData.stock
      });
      expect(response.body.id).toBeDefined();
    });

    it("deve retornar erro ao tentar criar produto sem nome", async () => {
      const productData = {
        description: "Descrição do produto",
        purchasePrice: 100,
        stock: 10
      };

      const response = await request(app)
        .post("/products")
        .send(productData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
  });
}); 
