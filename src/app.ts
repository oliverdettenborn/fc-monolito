import express from "express";
import createProductRouter from "./modules/product-adm/infrastructure/api/product.route";
import createClientRouter from "./modules/client-adm/infrastructure/api/client.route";
import createCheckoutRouter from "./modules/checkout/infrastructure/api/checkout.route";
import createInvoiceRouter from "./modules/invoice/infrastructure/api/invoice.route";
import ProductAdmFacade from "./modules/product-adm/facade/product-adm.facade";
import ClientAdmFacade from "./modules/client-adm/facade/client-adm.facade";
import CheckoutFacade from "./modules/checkout/facade/checkout.facade";
import InvoiceFacade from "./modules/invoice/facade/invoice.facade";
// Produto
import ProductRepository from "./modules/product-adm/repository/product.repository";
import AddProductUseCase from "./modules/product-adm/usecase/add-product/add-product.usecase";
import CheckStockUseCase from "./modules/product-adm/usecase/check-stock/check-stock.usecase";
// Cliente
import ClientRepository from "./modules/client-adm/repository/client.repository";
import AddClientUseCase from "./modules/client-adm/usecase/add-client/add-client.usecase";
import FindClientUseCase from "./modules/client-adm/usecase/find-client/find-client.usecase";
// Invoice
import InvoiceRepository from "./modules/invoice/repository/invoice.repository";
import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./modules/invoice/repository/invoice.model";
import InvoiceItemModel from "./modules/invoice/repository/invoice-item.model";
import { ProductModel } from "./modules/product-adm/repository/product.model";
import { ClientModel } from "./modules/client-adm/repository/client.model";

const app = express();

app.use(express.json());

// Instanciar repositórios reais
const productRepository = new ProductRepository();
const clientRepository = new ClientRepository();
const invoiceRepository = new InvoiceRepository();

// Instanciar casos de uso reais
const addProductUseCase = new AddProductUseCase(productRepository);
const checkStockUseCase = new CheckStockUseCase(productRepository);
const addClientUseCase = new AddClientUseCase(clientRepository);
const findClientUseCase = new FindClientUseCase(clientRepository);

// Criar instâncias dos facades com casos de uso reais
const productFacade = new ProductAdmFacade({
  addUseCase: addProductUseCase,
  stockUseCase: checkStockUseCase
});

const clientFacade = new ClientAdmFacade({
  findUsecase: findClientUseCase,
  addUsecase: addClientUseCase
});

const checkoutFacade = new CheckoutFacade();
const invoiceFacade = new InvoiceFacade(invoiceRepository);

// Registra todas as rotas
app.use(createProductRouter(productFacade));
app.use(createClientRouter(clientFacade));
app.use(createCheckoutRouter(checkoutFacade));
app.use(createInvoiceRouter(invoiceFacade));

// Inicializa o Sequelize global
export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: false,
});

sequelize.addModels([
  InvoiceModel,
  InvoiceItemModel,
  ProductModel,
  ClientModel,
]);

// Sincroniza o banco
sequelize.sync();

export default app; 
