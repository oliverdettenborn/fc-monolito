import Invoice from "../domain/entity/invoice";
import InvoiceGateway from "../gateway/invoice.gateway";
import Id from "../../@shared/domain/value-object/id.value-object";

export default class InvoiceRepository implements InvoiceGateway {
  private _invoices: Invoice[] = [];

  async generate(invoice: Invoice): Promise<void> {
    this._invoices.push(invoice);
  }

  async find(id: string): Promise<Invoice> {
    const invoice = this._invoices.find((invoice) => invoice.id.id === id);
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    return invoice;
  }
} 
