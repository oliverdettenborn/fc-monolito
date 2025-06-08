import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { PlaceOrderFacadeInputDto, PlaceOrderFacadeOutputDto } from "./checkout.facade.dto";

export interface UseCaseProps {
  placeOrderUseCase: UseCaseInterface;
}

export default class CheckoutFacade {
  private _placeOrderUseCase: UseCaseInterface;

  constructor(usecaseProps: UseCaseProps) {
    this._placeOrderUseCase = usecaseProps.placeOrderUseCase;
  }

  async placeOrder(input: PlaceOrderFacadeInputDto): Promise<PlaceOrderFacadeOutputDto> {
    return await this._placeOrderUseCase.execute(input);
  }
} 
