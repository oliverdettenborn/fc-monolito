import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import ClientAdmFacadeInterface, { FindClientFacadeOutputDto } from "../../../client-adm/facade/client-adm.facade.interface";
import InvoiceFacadeInterface from "../../../invoice/facade/facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase {
    constructor(
        private _clientFacade: ClientAdmFacadeInterface, 
        private _storeCatalogFacade: StoreCatalogFacadeInterface,
        private _productFacade: ProductAdmFacadeInterface,
        private _paymentFacade: PaymentFacadeInterface,
        private _invoiceFacade: InvoiceFacadeInterface,
        private _checkoutRepository: CheckoutGateway,
    ) {}

    async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
        const client = await this._clientFacade.find({ id: input.clientId });
        if (!client) {
            throw new Error("Client not found");
        }

        const products = await this.validateProducts(input);

        const clientOrder = this.createClientOrder(client);

        const order = this.createOrder(clientOrder, products);

        const payment = await this._paymentFacade.process({
            orderId: order.id.id,
            amount: order.total,
        });

        if (payment.status === "declined") {
            order.cancel();
        }

        let invoiceId = null;
        if (payment.status === "approved") {
            const invoice = await this._invoiceFacade.generate({
                name: client.name,
                document: client.document,
                street: client.address.street,
                number: client.address.number,
                complement: client.address.complement,
                city: client.address.city,
                state: client.address.state,
                zipCode: client.address.zipCode,
                items: products.map((product) => ({
                    id: product.id.id,
                    name: product.name,
                    price: product.salesPrice,
                })),
            });

            invoiceId = invoice.id;
            order.approve();
        }

        await this._checkoutRepository.addOrder(order);

        return {
            id: order.id.id,
            invoiceId: invoiceId,
            status: order.status,
            total: order.total,
            products: order.products.map((product) => ({
                productId: product.id.id,
                quantity: product.quantity
            }))
        };
    }

    private createClientOrder(client: FindClientFacadeOutputDto) {
        return new Client({
            id: new Id(client.id),
            name: client.name,
            email: client.email,
            address: new Address(
                client.address.street,
                client.address.number,
                client.address.complement,
                client.address.city,
                client.address.state,
                client.address.zipCode
            ),
        });
    }

    private createOrder(client: Client, products: Product[]) {
        return new Order({
            client: client,
            products: products,
        });
    }

    private async validateProducts(input: PlaceOrderInputDto): Promise<Product[]> {
        if (input.products.length === 0) {
            throw new Error("No products selected");
        }

        const  products = await this.getProduct(input);

        await Promise.all(products.map(async (product) => {
            const productStock = await this._productFacade.checkStock({ productId: product.id.id });
            if (productStock.stock <= 0) {
                throw new Error("Product does not have stock");
            }
        }));

        return products;
    }

    private async getProduct(input: PlaceOrderInputDto): Promise<Product[]> {
        return await Promise.all(input.products.map(async (item) => {
            const product = await this._storeCatalogFacade.find({ id: item.productId });

            if (!product) {
                throw new Error("Product not found");
            }

            return new Product({
                id: new Id(product.id),
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice,
                quantity: item.quantity
            });
        }));
    }
}
