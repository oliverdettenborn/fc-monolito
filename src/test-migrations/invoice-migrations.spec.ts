import { Sequelize } from "sequelize-typescript"
import express, { Express } from 'express'
import request from 'supertest'
import InvoiceModel from "../modules/invoice/repository/invoice.model"
import InvoiceItemModel from "../modules/invoice/repository/invoice-item.model"
import { Umzug } from "umzug"
import invoiceRoutes from "../modules/invoice/infrastructure/api/invoice.route"
import { setupTestDatabase, teardownTestDatabase } from "./config-migrations/test-setup"

describe("Invoice tests", () => {
  const app: Express = express()
  app.use(express.json())
  app.use(invoiceRoutes)

  let sequelize: Sequelize
  let migration: Umzug<any>;

  beforeEach(async () => {
    const setup = await setupTestDatabase({
      models: [InvoiceModel, InvoiceItemModel],
    });
    sequelize = setup.sequelize;
    migration = setup.migration;
  })

  afterEach(async () => {
    await teardownTestDatabase(sequelize, migration);
  })

  it("should create an invoice", async () => {
    const response = await request(app).post("/invoice").send({
      name: "John Doe",
      document: "12345678900",
      street: "Street 1",
      number: "123",
      complement: "Apt 1",
      city: "City 1",
      state: "State 1",
      zipCode: "12345678",
      items: [
        {
          name: "Item 1",
          price: 100
        }
      ]
    })

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("John Doe")
    expect(response.body.document).toBe("12345678900")
    expect(response.body.items).toHaveLength(1)
    expect(response.body.items[0].name).toBe("Item 1")
    expect(response.body.items[0].price).toBe(100)
  })
}) 
