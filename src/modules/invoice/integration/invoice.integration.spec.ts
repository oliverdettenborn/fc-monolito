import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceFacade from "../facade/invoice.facade";
import { setupTestDatabase, teardownTestDatabase } from "../../../test-migrations/config-migrations/test-setup";

describe("Invoice Integration Tests", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;
  let facade: InvoiceFacade;

  beforeEach(async () => {
    const setup = await setupTestDatabase({
      models: [InvoiceModel, InvoiceItemModel],
    });
    sequelize = setup.sequelize;
    migration = setup.migration;
    facade = new InvoiceFacade();
  });

  afterEach(async () => {
    await teardownTestDatabase(sequelize, migration);
  });

  it("should generate an invoice", async () => {
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

    const result = await facade.generate(input);

    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.street).toBe(input.street);
    expect(result.number).toBe(input.number);
    expect(result.complement).toBe(input.complement);
    expect(result.city).toBe(input.city);
    expect(result.state).toBe(input.state);
    expect(result.zipCode).toBe(input.zipCode);
    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(300);
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

    const generatedInvoice = await facade.generate(input);
    const result = await facade.find({ id: generatedInvoice.id });

    expect(result.id).toBe(generatedInvoice.id);
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.address.street).toBe(input.street);
    expect(result.address.number).toBe(input.number);
    expect(result.address.complement).toBe(input.complement);
    expect(result.address.city).toBe(input.city);
    expect(result.address.state).toBe(input.state);
    expect(result.address.zipCode).toBe(input.zipCode);
    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(300);
  });
}); 
