import Invoice from "./invoice";
import Address from "../value-object/address";
import InvoiceItem from "./invoice-item";
import Id from "../../../@shared/domain/value-object/id.value-object";

describe("Invoice unit tests", () => {
  it("should create an invoice", () => {
    const address = new Address(
      "Street 1",
      "1",
      "Complement 1",
      "City 1",
      "State 1",
      "12345-678"
    );

    const item1 = new InvoiceItem({
      id: new Id("1"),
      name: "Item 1",
      price: 100,
    });

    const item2 = new InvoiceItem({
      id: new Id("2"),
      name: "Item 2",
      price: 200,
    });

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "123456789",
      address,
      items: [item1, item2],
    });

    expect(invoice.id).toBeDefined();
    expect(invoice.name).toBe("Invoice 1");
    expect(invoice.document).toBe("123456789");
    expect(invoice.address).toBe(address);
    expect(invoice.items).toHaveLength(2);
    expect(invoice.total).toBe(300);
  });

  it("should throw error when items is empty", () => {
    const address = new Address(
      "Street 1",
      "1",
      "Complement 1",
      "City 1",
      "State 1",
      "12345-678"
    );

    expect(() => {
      new Invoice({
        id: new Id("1"),
        name: "Invoice 1",
        document: "123456789",
        address,
        items: [],
      });
    }).toThrow("Invoice must have at least one item");
  });
}); 
