import express, { Express } from "express";
import request from "supertest";
import createClientRouter from "./client.route";
import ClientAdmFacadeFactory from "../../factory/client-adm.facade.factory";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { setupTestDatabase, teardownTestDatabase } from "../../../../test-migrations/config-migrations/test-setup";
import { ClientModel } from "../../repository/client.model";

describe("Client Routes E2E", () => {
  let app: Express;
  let sequelize: Sequelize;
  let migration: Umzug<any>;
  let facade: any;

  beforeEach(async () => {
    app = express();
    app.use(express.json());

    const setup = await setupTestDatabase({
      models: [ClientModel],
    });
    sequelize = setup.sequelize;
    migration = setup.migration;

    facade = ClientAdmFacadeFactory.create();
    app.use(createClientRouter(facade));
  });

  afterEach(async () => {
    await teardownTestDatabase(sequelize, migration);
  });

  describe("POST /clients", () => {
    it("deve criar um cliente com sucesso", async () => {
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

      const response = await request(app)
        .post("/clients")
        .send(clientData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        name: clientData.name,
        email: clientData.email,
        document: clientData.document,
        address: clientData.address
      });
      expect(response.body.id).toBeDefined();
    });

    it("deve retornar erro ao tentar criar cliente sem email", async () => {
      const clientData = {
        name: "Cliente Teste",
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

      const response = await request(app)
        .post("/clients")
        .send(clientData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
  });
}); 
