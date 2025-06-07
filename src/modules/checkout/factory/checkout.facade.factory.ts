import CheckoutFacade from "../facade/checkout.facade";

export default class CheckoutFacadeFactory {
  static create(): CheckoutFacade {
    return new CheckoutFacade();
  }
} 
