import { Sequelize } from "sequelize-typescript";
import { OrderModel } from "./order.model";
import { OrderProductModel } from "./order-product.model";
import CheckoutRepository from "./checkout.repository";
import Order from "../domain/order.entity";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";

describe("Checkout Repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true }
    });

    sequelize.addModels([OrderModel, OrderProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create an order", async () => {
    const client = new Client({
      id: new Id("1"),
      name: "Lucian",
      email: "lucian@teste.com",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      )
    });

    const product1 = new Product({
      id: new Id("1"),
      name: "Product 1",
      description: "Description 1",
      salesPrice: 100,
      quantity: 2
    });

    const product2 = new Product({
      id: new Id("2"),
      name: "Product 2",
      description: "Description 2",
      salesPrice: 200,
      quantity: 3
    });

    const order = new Order({
      id: new Id("1"),
      client,
      products: [product1, product2],
      status: "pending"
    });

    const repository = new CheckoutRepository();
    await repository.addOrder(order);

    const orderDb = await OrderModel.findOne({
      where: { id: "1" },
      include: [OrderProductModel]
    });

    expect(orderDb).toBeDefined();
    expect(orderDb.id).toEqual(order.id.id);
    expect(orderDb.client_id).toEqual(order.client.id.id);
    expect(orderDb.client_name).toEqual(order.client.name);
    expect(orderDb.client_email).toEqual(order.client.email);
    expect(orderDb.client_street).toEqual(order.client.address.street);
    expect(orderDb.client_number).toEqual(order.client.address.number);
    expect(orderDb.client_complement).toEqual(order.client.address.complement);
    expect(orderDb.client_city).toEqual(order.client.address.city);
    expect(orderDb.client_state).toEqual(order.client.address.state);
    expect(orderDb.client_zip_code).toEqual(order.client.address.zipCode);
    expect(orderDb.status).toEqual(order.status);
    expect(orderDb.total).toEqual(order.total);

    expect(orderDb.OrderProducts).toHaveLength(2);
    expect(orderDb.OrderProducts[0].product_id).toEqual(product1.id.id);
    expect(orderDb.OrderProducts[0].product_name).toEqual(product1.name);
    expect(orderDb.OrderProducts[0].product_description).toEqual(product1.description);
    expect(orderDb.OrderProducts[0].price).toEqual(product1.salesPrice);
    expect(orderDb.OrderProducts[0].quantity).toEqual(product1.quantity);
    expect(orderDb.OrderProducts[1].product_id).toEqual(product2.id.id);
    expect(orderDb.OrderProducts[1].product_name).toEqual(product2.name);
    expect(orderDb.OrderProducts[1].product_description).toEqual(product2.description);
    expect(orderDb.OrderProducts[1].price).toEqual(product2.salesPrice);
    expect(orderDb.OrderProducts[1].quantity).toEqual(product2.quantity);
  });

  it("should find an order", async () => {
    const order = await OrderModel.create({
      id: "1",
      client_id: "1",
      client_name: "Lucian",
      client_email: "lucian@teste.com",
      client_document: "1234-5678",
      client_street: "Rua 123",
      client_number: "99",
      client_complement: "Casa Verde",
      client_city: "Criciúma",
      client_state: "SC",
      client_zip_code: "88888-888",
      status: "pending",
      total: 300,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await OrderProductModel.create({
      id: "1",
      order_id: "1",
      product_id: "1",
      product_name: "Product 1",
      product_description: "Description 1",
      quantity: 2,
      price: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await OrderProductModel.create({
      id: "2",
      order_id: "1",
      product_id: "2",
      product_name: "Product 2",
      product_description: "Description 2",
      quantity: 3,
      price: 200,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const repository = new CheckoutRepository();
    const result = await repository.findOrder("1");

    expect(result.id.id).toEqual(order.id);
    expect(result.client.id.id).toEqual(order.client_id);
    expect(result.client.name).toEqual(order.client_name);
    expect(result.client.email).toEqual(order.client_email);
    expect(result.client.address.street).toEqual(order.client_street);
    expect(result.client.address.number).toEqual(order.client_number);
    expect(result.client.address.complement).toEqual(order.client_complement);
    expect(result.client.address.city).toEqual(order.client_city);
    expect(result.client.address.state).toEqual(order.client_state);
    expect(result.client.address.zipCode).toEqual(order.client_zip_code);
    expect(result.status).toEqual(order.status);
    expect(result.total).toEqual(order.total);

    expect(result.products).toHaveLength(2);
    expect(result.products[0].id.id).toEqual("1");
    expect(result.products[0].name).toEqual("Product 1");
    expect(result.products[0].description).toEqual("Description 1");
    expect(result.products[0].salesPrice).toEqual(100);
    expect(result.products[0].quantity).toEqual(2);
    expect(result.products[1].id.id).toEqual("2");
    expect(result.products[1].name).toEqual("Product 2");
    expect(result.products[1].description).toEqual("Description 2");
    expect(result.products[1].salesPrice).toEqual(200);
    expect(result.products[1].quantity).toEqual(3);
  });

  it("should create an order with correct quantities", async () => {
    await OrderModel.create({
      id: "order-2",
      client_id: "1",
      client_name: "Client 1",
      client_email: "client1@example.com",
      client_document: "1234567890",
      client_street: "Rua Teste",
      client_number: "123",
      client_complement: "Apto 1",
      client_city: "Cidade Teste",
      client_state: "Estado Teste",
      client_zip_code: "12345-678",
      status: "approved",
      total: 500,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await OrderProductModel.create({
      id: "op-1",
      order_id: "order-2",
      product_id: "1",
      product_name: "Product 1",
      product_description: "Description 1",
      quantity: 2,
      price: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await OrderProductModel.create({
      id: "op-2",
      order_id: "order-2",
      product_id: "2",
      product_name: "Product 2",
      product_description: "Description 2",
      quantity: 3,
      price: 200,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const repository = new CheckoutRepository();
    const result = await repository.findOrder("order-2");
    expect(result.products[0].quantity).toEqual(2);
    expect(result.products[1].quantity).toEqual(3);
  });
}); 
