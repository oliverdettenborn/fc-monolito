import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import { FindClientFacadeOutputDto } from "../../../client-adm/facade/client-adm.facade.interface";
import Client from "../../domain/client.entity";
import Product from "../../domain/product.entity";
import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";

describe("PlaceOrderUseCase unit test", () => {
    const mockClientFacade = {
        find: jest.fn().mockResolvedValue({ 
            id: "1", 
            name: "Client 1", 
            email: "client1@example.com",
            address: { street: "123 Main St", number: "123", complement: "Apt 1", city: "Anytown", state: "CA", zipCode: "12345" },
            document: "1234567890",
            createdAt: new Date(),
            updatedAt: new Date() }),
    } as any;
    const mockBaseProductAdmFacade = {
        checkStock: jest.fn().mockResolvedValue({ stock: 10 }),
    } as any;
    const mockBaseStoreCatalogFacade = {
        find: jest.fn().mockResolvedValue({ id: "1", name: "Product 1", salesPrice: 100 }),
    } as any;
    const mockPaymentFacade = {
        process: jest.fn().mockResolvedValue({ status: "approved" }),
    } as any;
    const mockInvoiceFacade = {
        generate: jest.fn().mockResolvedValue({ id: "1" }),
    } as any;

    let placeOrderUseCase: PlaceOrderUseCase;

    beforeEach(() => {
        placeOrderUseCase = new PlaceOrderUseCase(
            mockClientFacade, 
            mockBaseStoreCatalogFacade, 
            mockBaseProductAdmFacade,
            mockPaymentFacade,
            mockInvoiceFacade
        );
    });

    describe("validateProducts method", () => {
        it("Should throw an error if products is empty", async () => {
            const input: PlaceOrderInputDto = {
                clientId: "1",
                products: []
            };

            // @ts-expect-error - validateProducts is private
            await expect(placeOrderUseCase.validateProducts(input)).rejects.toThrow("No products selected");
        });

        it("Should throw an error if product is not found", async () => {
            const mockStoreCatalogFacade = {
                find: jest.fn().mockResolvedValue(null),
            } as any;

            placeOrderUseCase["_storeCatalogFacade"] = mockStoreCatalogFacade;

            const input: PlaceOrderInputDto = {
                clientId: "1",
                products: [{ productId: "1" }]
            };

            // @ts-expect-error - validateProducts is private
            await expect(placeOrderUseCase.validateProducts(input)).rejects.toThrow("Product not found");
        });

        it("Should throw an error if product does not have stock", async () => {
            const mockProductFacade = {
                checkStock: jest.fn().mockResolvedValue({ stock: 0 }),
            } as any;
            placeOrderUseCase["_productFacade"] = mockProductFacade;

            const input: PlaceOrderInputDto = {
                clientId: "1",
                products: [{ productId: "1" }]
            };

            // @ts-expect-error - validateProducts is private
            await expect(placeOrderUseCase.validateProducts(input)).rejects.toThrow("Product does not have stock");
            expect(mockProductFacade.checkStock).toHaveBeenCalledWith({ productId: "1" });
            expect(mockBaseStoreCatalogFacade.find).toHaveBeenCalledWith({ id: "1" });
        });
        
        it("Should return the products if they are valid", async () => {
            const input: PlaceOrderInputDto = {
                clientId: "1",
                products: [{ productId: "1" }]
            };

            // @ts-expect-error - validateProducts is private
            const result = await placeOrderUseCase.validateProducts(input);
            expect(result.length).toBe(1);
            expect(result[0].id.id).toBe("1");
            expect(result[0].name).toBe("Product 1");
            expect(result[0].salesPrice).toBe(100);
            expect(mockBaseStoreCatalogFacade.find).toHaveBeenCalledWith({ id: "1" });
            expect(mockBaseProductAdmFacade.checkStock).toHaveBeenCalledWith({ productId: "1" });
        });
    });

    describe("createClientOrder method", () => {
        it("Should create a client order", () => {
            const client: FindClientFacadeOutputDto = {
                id: "1",
                name: "Client 1",
                email: "client1@example.com",
                address: new Address("123 Main St", "123", "Apt 1", "Anytown", "CA", "12345"),
                document: "1234567890",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            // @ts-expect-error - createClientOrder is private
            const result = placeOrderUseCase.createClientOrder(client);
            
            expect(result.id.id).toBe("1");
            expect(result.name).toBe("Client 1");
            expect(result.email).toBe("client1@example.com");
            expect(result.address.street).toBe("123 Main St");
            expect(result.address.number).toBe("123");
            expect(result.address.complement).toBe("Apt 1");
            expect(result.address.city).toBe("Anytown");
        });
    });

    describe("createOrder method", () => {
        it("Should create an order", () => {
            const client = new Client({
                id: new Id("1"),
                name: "Client 1",
                email: "client1@example.com",
                address: new Address("123 Main St", "123", "Apt 1", "Anytown", "CA", "12345"),
            });
            const products = [new Product({
                id: new Id("1"),
                name: "Product 1",
                description: "Product 1 description",
                salesPrice: 100,
            })];

            // @ts-expect-error - createOrder is private
            const result = placeOrderUseCase.createOrder(client, products);

            expect(result.id.id).toBeDefined();
            expect(result.client.id.id).toBe("1");
            expect(result.products.length).toBe(1);
            expect(result.products[0].id.id).toBe("1");
            expect(result.products[0].name).toBe("Product 1");
            expect(result.products[0].salesPrice).toBe(100);
            expect(result.products[0].description).toBe("Product 1 description");
        });
    });
    
    describe("execute method", () => {
        it("Should throw an error if client is not found", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(null),
            } as any;
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = {
                clientId: "1",
                products: [{ productId: "1" }]
            };
            
            await expect(placeOrderUseCase.execute(input)).rejects.toThrow("Client not found");
        });

        it("Should throw an error if product are not valid", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue({ id: "1", name: "Client 1" }),
            } as any;
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = {
                clientId: "1",
                products: []
            };

            const mockValidateProducts = jest.spyOn(placeOrderUseCase as any, "validateProducts");

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow("No products selected");
            expect(mockValidateProducts).toHaveBeenCalled();
        });

        it("Should create an order with products", async () => {
            const input: PlaceOrderInputDto = {
                clientId: "1",
                products: [{ productId: "1" }]
            };
            const mockSpyCreateClientOrder = jest.spyOn(placeOrderUseCase as any, "createClientOrder");
            const mockSpyCreateOrder = jest.spyOn(placeOrderUseCase as any, "createOrder");
            const mockSpyValidateProducts = jest.spyOn(placeOrderUseCase as any, "validateProducts");

            await placeOrderUseCase.execute(input);

            expect(mockSpyCreateClientOrder).toHaveBeenCalled();
            expect(mockSpyCreateOrder).toHaveBeenCalled();
            expect(mockSpyValidateProducts).toHaveBeenCalled();
        });

        it("Should create an order with products and return the order", async () => {
            const input: PlaceOrderInputDto = {
                clientId: "1",
                products: [{ productId: "1" }]
            };

            const mockSpyCreateClientOrder = jest.spyOn(placeOrderUseCase as any, "createClientOrder");
            const mockSpyCreateOrder = jest.spyOn(placeOrderUseCase as any, "createOrder");
            const mockSpyValidateProducts = jest.spyOn(placeOrderUseCase as any, "validateProducts");

            await placeOrderUseCase.execute(input);
            
            expect(mockSpyCreateClientOrder).toHaveBeenCalled();
            expect(mockSpyCreateOrder).toHaveBeenCalled();
            expect(mockSpyValidateProducts).toHaveBeenCalled();
        });

        it("Should call facade to process the payment", async () => {
            const input: PlaceOrderInputDto = {
                clientId: "1",
                products: [{ productId: "1" }]
            };

            await placeOrderUseCase.execute(input);

            expect(mockPaymentFacade.process).toHaveBeenCalled();
        });

        it("Should cancel the order if the payment is declined", async () => {
            const input: PlaceOrderInputDto = {
                clientId: "1",
                products: [{ productId: "1" }]
            };
            const mockPaymentFacade = {
                process: jest.fn().mockResolvedValue({ status: "declined" }),
            } as any;
            placeOrderUseCase["_paymentFacade"] = mockPaymentFacade;

            const result = await placeOrderUseCase.execute(input);
            
            expect(mockPaymentFacade.process).toHaveBeenCalled();
            expect(result.status).toBe("canceled");
            expect(result.invoiceId).toBeNull();
        });

        it("Should create an invoice if the payment is approved", async () => {
            const input: PlaceOrderInputDto = {
                clientId: "1",
                products: [{ productId: "1" }]
            };
            const invoiceId = "1";
            const mockInvoiceFacade = {
                generate: jest.fn().mockResolvedValue({ id: invoiceId }),
            } as any;
            placeOrderUseCase["_invoiceFacade"] = mockInvoiceFacade;
            
            const result = await placeOrderUseCase.execute(input);

            expect(result.invoiceId).toBe(invoiceId);
            expect(result.status).toBe("approved");
        });
    });
});

