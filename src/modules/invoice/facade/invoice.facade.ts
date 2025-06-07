import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "../usecase/generate-invoice/generate-invoice.dto";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "../usecase/find-invoice/find-invoice.dto";

export default class InvoiceFacade {
  private _generateInvoiceUseCase: GenerateInvoiceUseCase;
  private _findInvoiceUseCase: FindInvoiceUseCase;

  constructor(invoiceRepository: InvoiceRepository) {
    this._generateInvoiceUseCase = new GenerateInvoiceUseCase(invoiceRepository);
    this._findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);
  }

  async generate(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
    return await this._generateInvoiceUseCase.execute(input);
  }

  async find(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
    return await this._findInvoiceUseCase.execute(input);
  }
} 
