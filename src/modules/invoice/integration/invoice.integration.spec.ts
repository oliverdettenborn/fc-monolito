import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { migrator } from "../../../test-migrations/config-migrations/migrator";
import app from "../../../app";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemModel from "../repository/invoice-item.model";

describe("Invoice API Integration Test", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();

    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    await migration.down();
    await sequelize.close();
  });

  it("should create an invoice", async () => {
    const input = {
      name: "Invoice 1",
      document: "123456789",
      street: "Street 1",
      number: "1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "12345-678",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100,
        },
        {
          id: "2",
          name: "Item 2",
          price: 200,
        },
      ],
    };

    const response = await request(app)
      .post("/invoice")
      .send(input);

    expect(response.status).toBe(201);
    expect(typeof response.body.id).toBe("string");
    expect(response.body).toMatchObject({
      name: input.name,
      document: input.document,
      street: input.street,
      number: input.number,
      complement: input.complement,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
      items: input.items,
      total: 300,
    });
  });

  it("should find an invoice", async () => {
    const input = {
      name: "Invoice 1",
      document: "123456789",
      street: "Street 1",
      number: "1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "12345-678",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100,
        },
        {
          id: "2",
          name: "Item 2",
          price: 200,
        },
      ],
    };
    const createResponse = await request(app)
      .post("/invoice")
      .send(input);
    const id = createResponse.body.id;

    const response = await request(app)
      .get(`/invoice/${id}`);

    expect(response.status).toBe(200);
    expect(typeof response.body.id).toBe("string");
    expect(response.body).toMatchObject({
      name: "Invoice 1",
      document: "123456789",
      address: {
        street: "Street 1",
        number: "1",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "12345-678",
      },
      items: [
        { id: "1", name: "Item 1", price: 100 },
        { id: "2", name: "Item 2", price: 200 },
      ],
      total: 300,
    });
  });
}); 
