import Invoice from "../domain/entity/invoice";
import InvoiceGateway from "../gateway/invoice.gateway";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";
import Address from "../domain/value-object/address";
import InvoiceItem from "../domain/entity/invoice-item";

export default class InvoiceRepository implements InvoiceGateway {
  async generate(invoice: Invoice): Promise<void> {
    await InvoiceModel.create(
      {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
        items: invoice.items.map((item) => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
        })),
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
      },
      {
        include: [{ model: InvoiceItemModel }],
      }
    );
  }

  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: { id },
      include: [{ model: InvoiceItemModel }],
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const address = new Address(
      invoice.street,
      invoice.number,
      invoice.complement,
      invoice.city,
      invoice.state,
      invoice.zipCode
    );

    const items = invoice.items.map(
      (item) =>
        new InvoiceItem({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })
    );

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address,
      items,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    });
  }
} 
