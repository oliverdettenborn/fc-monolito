import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import CheckoutFacade from "../facade/checkout.facade";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

export default class CheckoutFacadeFactory {
  static create(): CheckoutFacade {
    const productFacade = ProductAdmFacadeFactory.create();
    const clientFacade = ClientAdmFacadeFactory.create();
    const invoiceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();
    const storeCatalogFacade = StoreCatalogFacadeFactory.create();
    const placeOrderUseCase = new PlaceOrderUseCase(
      clientFacade,
      storeCatalogFacade,
      productFacade,
      paymentFacade,
      invoiceFacade
    );

    return new CheckoutFacade({
      placeOrderUseCase: placeOrderUseCase
    });
  }
} 
