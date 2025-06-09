import { PlaceOrderFacadeInputDto } from "./checkout.facade.dto";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { setupTestDatabase, teardownTestDatabase } from "../../../test-migrations/config-migrations/test-setup";
import { ClientModel } from "../../client-adm/repository/client.model";
import CheckoutFacadeFactory from "../factory/checkout.facade.factory";
import ProductModelStoreCatalog from "../../store-catalog/repository/product.model";
import { ProductModel as ProductModelProductAdm } from "../../product-adm/repository/product.model";
import InvoiceItemModel from "../../invoice/repository/invoice-item.model";
import InvoiceModel from "../../invoice/repository/invoice.model";
import TransactionModel from "../../payment/repository/transaction.model";
import { OrderProductModel } from "../repository/order-product.model";
import { OrderModel } from "../repository/order.model";

const clientData = {
    id: "1",
    name: "Client 1",
    email: "client1@example.com",
    document: "1234567890",
    street: "123 Main St",
    number: "123",
    complement: "Apt 1",
    city: "Anytown",
    state: "CA",
    zipcode: "12345",
    createdAt: new Date(),
    updatedAt: new Date()
}

describe("Checkout Facade test", () => {
    let sequelize: Sequelize;
    let migration: Umzug<any>;
  
    beforeAll(async () => {
        const setup = await setupTestDatabase({
            models: [
                ClientModel,
                ProductModelProductAdm,
                ProductModelStoreCatalog,
                InvoiceModel,
                InvoiceItemModel,
                TransactionModel,
                OrderModel,
                OrderProductModel
            ],
        });
        sequelize = setup.sequelize;
        migration = setup.migration;
    });

    beforeEach(async () => {
        await ClientModel.create(clientData);

        await ProductModelProductAdm.create({
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 100,
            salesPrice: 100,
            stock: 10,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await ProductModelProductAdm.create({
            id: "2",
            name: "Product 2",
            description: "Product 2 description",
            purchasePrice: 200,
            salesPrice: 200,
            stock: 20,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    });
  
    afterAll(async () => {
        await teardownTestDatabase(sequelize, migration);
    });

    it("should place an order", async () => {
        const facade = CheckoutFacadeFactory.create();

        const input: PlaceOrderFacadeInputDto = {
            clientId: clientData.id,
            products: [
                {
                    productId: "1",
                    quantity: 1,
                },
                {
                    productId: "2",
                    quantity: 2,
                },
            ],
        };

        const result = await facade.placeOrder(input);

        expect(result.id).toBeDefined();
        expect(result.invoiceId).toBeDefined();
        expect(result.status).toBe("approved");
        expect(result.total).toBe(300);
        expect(result.products).toHaveLength(2);
        expect(result.products).toEqual(input.products);
    });
}); 
