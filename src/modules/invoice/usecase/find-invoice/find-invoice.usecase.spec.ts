import FindInvoiceUseCase from "./find-invoice.usecase";
import Invoice from "../../domain/entity/invoice";
import Address from "../../domain/value-object/address";
import InvoiceItem from "../../domain/entity/invoice-item";
import Id from "../../../@shared/domain/value-object/id.value-object";

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn(),
  };
};

describe("Find Invoice usecase unit test", () => {
  it("should find an invoice", async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

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

    repository.find.mockResolvedValue(invoice);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toBe("1");
    expect(result.name).toBe("Invoice 1");
    expect(result.document).toBe("123456789");
    expect(result.address.street).toBe("Street 1");
    expect(result.address.number).toBe("1");
    expect(result.address.complement).toBe("Complement 1");
    expect(result.address.city).toBe("City 1");
    expect(result.address.state).toBe("State 1");
    expect(result.address.zipCode).toBe("12345-678");
    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(300);
  });

  it("should throw error when invoice not found", async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

    repository.find.mockRejectedValue(new Error("Invoice not found"));

    const input = {
      id: "1",
    };

    await expect(usecase.execute(input)).rejects.toThrow("Invoice not found");
  });
}); 
