import AddProductUseCase from "../usecase/add-product/add-product.usecase";
import CheckStockUseCase from "../usecase/check-stock/check-stock.usecase";
import ProductAdmFacadeInterface, {
  AddProductFacadeInputDto,
  AddProductFacadeOutputDto,
  CheckStockFacadeInputDto,
  CheckStockFacadeOutputDto,
} from "./product-adm.facade.interface";

export interface UseCasesProps {
  addUseCase: AddProductUseCase;
  stockUseCase: CheckStockUseCase;
}

export default class ProductAdmFacade implements ProductAdmFacadeInterface {
  private _addUsecase: AddProductUseCase;
  private _checkStockUsecase: CheckStockUseCase;

  constructor(usecasesProps: UseCasesProps) {
    this._addUsecase = usecasesProps.addUseCase;
    this._checkStockUsecase = usecasesProps.stockUseCase;
  }

  async addProduct(input: AddProductFacadeInputDto): Promise<AddProductFacadeOutputDto> {
    return this._addUsecase.execute(input);
  }
  checkStock(
    input: CheckStockFacadeInputDto
  ): Promise<CheckStockFacadeOutputDto> {
    return this._checkStockUsecase.execute(input);
  }
}
