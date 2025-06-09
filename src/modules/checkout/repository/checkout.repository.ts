import Id from "../../@shared/domain/value-object/id.value-object";
import Order from "../domain/order.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { OrderModel } from "./order.model";
import { OrderProductModel } from "./order-product.model";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";
import Address from "../../@shared/domain/value-object/address";

export default class CheckoutRepository implements CheckoutGateway {
    async addOrder(order: Order): Promise<void> {
        await OrderModel.create({
            id: order.id.id,
            client_id: order.client.id.id,
            client_name: order.client.name,
            client_email: order.client.email,
            client_document: "1234-5678",
            client_street: order.client.address.street,
            client_number: order.client.address.number,
            client_complement: order.client.address.complement,
            client_city: order.client.address.city,
            client_state: order.client.address.state,
            client_zip_code: order.client.address.zipCode,
            status: order.status,
            total: order.total,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        for (const product of order.products) {
            await OrderProductModel.create({
                id: new Id().id,
                order_id: order.id.id,
                product_id: product.id.id,
                product_name: product.name,
                product_description: product.description,
                quantity: 1,
                price: product.salesPrice,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
    }

    async findOrder(id: string): Promise<Order> {
        const order = await OrderModel.findOne({
            where: { id },
            include: [OrderProductModel]
        });

        if (!order) {
            throw new Error("Order not found");
        }

        const client = new Client({
            id: new Id(order.client_id),
            name: order.client_name,
            email: order.client_email,
            address: new Address(
                order.client_street,
                order.client_number,
                order.client_complement,
                order.client_city,
                order.client_state,
                order.client_zip_code
            )
        });

        const products = order.OrderProducts.map((op: OrderProductModel) => 
            new Product({
                id: new Id(op.product_id),
                name: op.product_name,
                description: op.product_description,
                salesPrice: op.price
            })
        );

        return new Order({
            id: new Id(order.id),
            client,
            products,
            status: order.status
        });
    }
} 
