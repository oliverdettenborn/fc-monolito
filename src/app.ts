import express from "express";
import createProductRouter from "./modules/product-adm/infrastructure/api/product.route";
import createClientRouter from "./modules/client-adm/infrastructure/api/client.route";
import createCheckoutRouter from "./modules/checkout/infrastructure/api/checkout.route";
import createInvoiceRouter from "./modules/invoice/infrastructure/api/invoice.route";
import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./modules/invoice/repository/invoice.model";
import InvoiceItemModel from "./modules/invoice/repository/invoice-item.model";
import { ProductModel } from "./modules/product-adm/repository/product.model";
import { ClientModel } from "./modules/client-adm/repository/client.model";

const app = express();

app.use(express.json());

app.use(createProductRouter());
app.use(createClientRouter());
app.use(createCheckoutRouter());
app.use(createInvoiceRouter());

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

sequelize.sync();

export default app; 
