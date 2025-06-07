import { Sequelize } from "sequelize-typescript";
import { migrator } from "../../../test-migrations/config-migrations/migrator";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceFacade from "./invoice.facade";
import { Umzug } from "umzug";
import InvoiceRepository from "../repository/invoice.repository";
import Invoice from "../domain/entity/invoice";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/value-object/address";
import InvoiceItem from "../domain/entity/invoice-item";

describe("Invoice Facade unit test", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;
  let facade: InvoiceFacade;
  let mockInvoiceRepository: jest.Mocked<InvoiceRepository>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    migration = migrator(sequelize);
    await migration.up();

    mockInvoiceRepository = {
      generate: jest.fn(),
      find: jest.fn(),
    } as any;

    facade = new InvoiceFacade(mockInvoiceRepository);
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return;
    }
    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
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

    const mockInvoice = new Invoice({
      id: new Id("1"),
      name: input.name,
      document: input.document,
      address: new Address(
        input.street,
        input.number,
        input.complement,
        input.city,
        input.state,
        input.zipCode
      ),
      items: input.items.map(
        (item) =>
          new InvoiceItem({
            id: new Id(item.id),
            name: item.name,
            price: item.price,
          })
      ),
    });

    mockInvoiceRepository.generate.mockResolvedValue();

    const result = await facade.generate(input);

    expect(typeof result.id).toBe("string");
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
    const mockInvoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "123456789",
      address: new Address(
        "Street 1",
        "1",
        "Complement 1",
        "City 1",
        "State 1",
        "12345-678"
      ),
      items: [
        new InvoiceItem({
          id: new Id("1"),
          name: "Item 1",
          price: 100,
        }),
        new InvoiceItem({
          id: new Id("2"),
          name: "Item 2",
          price: 200,
        }),
      ],
    });

    mockInvoiceRepository.find.mockResolvedValue(mockInvoice);

    const result = await facade.find({ id: "1" });

    expect(result.id).toBe("1");
    expect(result.name).toBe(mockInvoice.name);
    expect(result.document).toBe(mockInvoice.document);
    expect(result.address.street).toBe(mockInvoice.address.street);
    expect(result.address.number).toBe(mockInvoice.address.number);
    expect(result.address.complement).toBe(mockInvoice.address.complement);
    expect(result.address.city).toBe(mockInvoice.address.city);
    expect(result.address.state).toBe(mockInvoice.address.state);
    expect(result.address.zipCode).toBe(mockInvoice.address.zipCode);
    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(300);
  });
}); 
