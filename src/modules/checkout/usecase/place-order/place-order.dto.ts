export interface PlaceOrderInputDto {
    clientId: string;
    products: {
        productId: string;
        quantity?: number;
    }[];
}

export interface PlaceOrderOutputDto {
    id: string;
    invoiceId: string;
    status: string;
    total: number;
    products: {
        productId: string;
        quantity: number;
    }[];
}
