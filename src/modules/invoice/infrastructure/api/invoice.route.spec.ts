import express, { Express } from "express";
import request from "supertest";
import createInvoiceRouter from "./invoice.route";
import InvoiceFacadeFactory from "../../factory/invoice.facade.factory";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { setupTestDatabase, teardownTestDatabase } from "../../../../test-migrations/config-migrations/test-setup";
import InvoiceModel from "../../repository/invoice.model";
import InvoiceItemModel from "../../repository/invoice-item.model";

interface InvoiceItem {
  id: string;
  name: string;
  price: number;
}

describe("Invoice Routes E2E", () => {
  let app: Express;
  let sequelize: Sequelize;
  let migration: Umzug<any>;
  let facade: any;

  beforeEach(async () => {
    app = express();
    app.use(express.json());

    const setup = await setupTestDatabase({
      models: [InvoiceModel, InvoiceItemModel],
    });
    sequelize = setup.sequelize;
    migration = setup.migration;

    facade = InvoiceFacadeFactory.create();
    app.use(createInvoiceRouter(facade));
  });

  afterEach(async () => {
    await teardownTestDatabase(sequelize, migration);
  });

  describe("POST /invoice", () => {
    it("deve criar uma nota fiscal com sucesso", async () => {
      const invoiceData = {
        name: "Cliente Teste",
        document: "12345678900",
        street: "Rua Teste",
        number: "123",
        complement: "Apto 1",
        city: "Cidade Teste",
        state: "Estado Teste",
        zipCode: "12345-678",
        items: [
          {
            id: "1",
            name: "Produto 1",
            price: 100
          }
        ] as any[]
      };

      const response = await request(app)
        .post("/invoice")
        .send(invoiceData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        name: invoiceData.name,
        document: invoiceData.document,
        street: invoiceData.street,
        number: invoiceData.number,
        complement: invoiceData.complement,
        city: invoiceData.city,
        state: invoiceData.state,
        zipCode: invoiceData.zipCode,
        items: invoiceData.items,
        total: 100
      });
      expect(response.body.id).toBeDefined();
    });

    it("deve retornar erro ao tentar criar nota fiscal sem itens", async () => {
      const invoiceData = {
        name: "Cliente Teste",
        document: "12345678900",
        street: "Rua Teste",
        number: "123",
        complement: "Apto 1",
        city: "Cidade Teste",
        state: "Estado Teste",
        zipCode: "12345-678",
        items: [] as any[]
      };

      const response = await request(app)
        .post("/invoice")
        .send(invoiceData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Invoice must have at least one item");
    });
  });

  describe("GET /invoice/:id", () => {
    it("deve buscar uma nota fiscal existente", async () => {
      // Primeiro cria uma nota fiscal
      const invoiceData = {
        name: "Cliente Teste",
        document: "12345678900",
        street: "Rua Teste",
        number: "123",
        complement: "Apto 1",
        city: "Cidade Teste",
        state: "Estado Teste",
        zipCode: "12345-678",
        items: [
          {
            id: "1",
            name: "Produto 1",
            price: 100
          }
        ] as any[]
      };

      const createResponse = await request(app)
        .post("/invoice")
        .send(invoiceData);

      const invoiceId = createResponse.body.id;

      // Depois busca a nota fiscal criada
      const response = await request(app)
        .get(`/invoice/${invoiceId}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: invoiceId,
        name: invoiceData.name,
        document: invoiceData.document,
        address: {
          street: invoiceData.street,
          number: invoiceData.number,
          complement: invoiceData.complement,
          city: invoiceData.city,
          state: invoiceData.state,
          zipCode: invoiceData.zipCode
        },
        items: invoiceData.items,
        total: 100
      });
    });

    it("deve retornar erro ao buscar nota fiscal inexistente", async () => {
      const response = await request(app)
        .get("/invoice/inexistente");

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Invoice not found");
    });
  });
}); 
