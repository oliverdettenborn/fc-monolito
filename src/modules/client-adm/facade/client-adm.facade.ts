  import ClientAdmFacadeInterface, {
  AddClientFacadeInputDto,
  AddClientFacadeOutputDto,
  FindClientFacadeInputDto,
  FindClientFacadeOutputDto,
} from "./client-adm.facade.interface";
import Address from "../../@shared/domain/value-object/address";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";

export interface UseCaseProps {
  findUsecase: FindClientUseCase;
  addUsecase: AddClientUseCase;
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {
  private _findUsecase: FindClientUseCase;
  private _addUsecase: AddClientUseCase;

  constructor(usecaseProps: UseCaseProps) {
    this._findUsecase = usecaseProps.findUsecase;
    this._addUsecase = usecaseProps.addUsecase;
  }

  async add(input: AddClientFacadeInputDto): Promise<AddClientFacadeOutputDto> {
    const address = new Address(
      input.address.street,
      input.address.number,
      input.address.complement,
      input.address.city,
      input.address.state,
      input.address.zipCode
    );
    const client =  await this._addUsecase.execute({ ...input, address });

    return {
      id: client.id,
      createdAt: client.createdAt,
    };
  }
  async find(
    input: FindClientFacadeInputDto
  ): Promise<FindClientFacadeOutputDto> {
    return await this._findUsecase.execute(input);
  }
}
