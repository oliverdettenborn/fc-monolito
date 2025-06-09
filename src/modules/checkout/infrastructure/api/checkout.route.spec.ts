import express, { Express } from "express";
import request from "supertest";
import createCheckoutRouter from "./checkout.route";
import CheckoutFacadeFactory from "../../factory/checkout.facade.factory";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { setupTestDatabase, teardownTestDatabase } from "../../../../test-migrations/config-migrations/test-setup";
import { ClientModel } from "../../../client-adm/repository/client.model";
import { ProductModel as ProductModelAdm } from "../../../product-adm/repository/product.model";
import ProductModel from "../../../store-catalog/repository/product.model";
import TransactionModel from '../../../payment/repository/transaction.model';
import InvoiceModel from '../../../invoice/repository/invoice.model';
import InvoiceItemModel from '../../../invoice/repository/invoice-item.model';
import { OrderProductModel } from "../../repository/order-product.model";
import { OrderModel } from "../../repository/order.model";

describe("Checkout Routes E2E", () => {
  let app: Express;
  let sequelize: Sequelize;
  let migration: Umzug<any>;
  let facade: any;

  beforeEach(async () => {
    app = express();
    app.use(express.json());

    const setup = await setupTestDatabase({
      models: [ClientModel, ProductModelAdm, ProductModel, TransactionModel, InvoiceModel, InvoiceItemModel, OrderModel, OrderProductModel],
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
      const client = await ClientModel.create({
        id: "1",
        name: "Cliente Teste",
        email: "cliente@teste.com",
        document: "12345678900",
        street: "Rua Teste",
        number: "123",
        complement: "Apto 1",
        city: "Cidade Teste",
        state: "Estado Teste",
        zipcode: "12345-678",
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const product = await ProductModelAdm.create({
        id: "1",
        name: "Produto Teste",
        description: "Descrição do produto",
        purchasePrice: 100,
        salesPrice: 200,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const checkoutData = {
        clientId: client.id,
        products: [
          {
            productId: product.id,
            quantity: 1
          }
        ]
      };

      const response = await request(app)
        .post("/checkout")
        .send(checkoutData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
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
