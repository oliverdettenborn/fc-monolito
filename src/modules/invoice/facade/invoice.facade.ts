import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "../usecase/generate-invoice/generate-invoice.dto";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "../usecase/find-invoice/find-invoice.dto";
import InvoiceFacadeInterface from "./facade.interface";

export interface UseCaseProps {
  generateInvoiceUseCase: UseCaseInterface;
  findInvoiceUseCase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _generateInvoiceUseCase: UseCaseInterface;
  private _findInvoiceUseCase: UseCaseInterface;

  constructor(usecaseProps: UseCaseProps) {
    this._generateInvoiceUseCase = usecaseProps.generateInvoiceUseCase;
    this._findInvoiceUseCase = usecaseProps.findInvoiceUseCase;
  }

  async generate(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
    return await this._generateInvoiceUseCase.execute(input);
  }

  async find(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
    return await this._findInvoiceUseCase.execute(input);
  }
} 
