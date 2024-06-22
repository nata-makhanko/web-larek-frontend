export interface IProductList {
    total: number,
    items: IProduct[]
}

export interface IProduct {
    id: string,
    description: string,
    image: string,
    title: string,
    category: string,
    price: number | null;
}

export interface IOrder {
    payment: TPaymentMethod,
    email: string,
    phone: string,
    address: string,
    total: number,
    items: string[]
}

export interface IOrderResult {
    id: string;
    total: number;
}

export type TOrderForm = Omit<IOrder, 'total' | 'items'>;

export type TPaymentMethod = 'online' | 'cash';
