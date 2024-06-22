import { FormErrors } from "../types";
import { IOrder, IProduct, TPaymentMethod, TOrderForm } from "../types/api.type";
import { IBasket } from "../types/basket.type";
import { IEvents } from "./base/events";

export class AppData {
    items: IProduct[] = [];
    basket: IBasket = {
        items: [],
        total: 0
    };
    preview: IProduct = null;
    order: IOrder = {
        payment: 'online',
        email: '',
        phone: '',
        address: '',
        total: 0,
        items: [],
    };
    formErrors: FormErrors = {};

    constructor(protected events: IEvents) {}

    setItems(items: IProduct[]) {
        this.items = items;
        this.events.emit('items:change', this.items);
    }

    setPreview(item: IProduct) {
        this.preview = item;
        this.events.emit('preview:change', this.preview);
    }

    inBasket(item: IProduct) {
        return this.basket.items.includes(item.id);
    }

    addToBasket(item: IProduct) {
        this.basket.items.push(item.id);
        this.basket.total += item.price;
        this.events.emit('basket:change', this.basket);
    }

    removeFromBasket(item: IProduct) {
        this.basket.items =  this.basket.items.filter(itemBasket => itemBasket !== item.id);
        this.basket.total -= item.price;
        this.events.emit('basket:change', this.basket);
    }

    clearBasket() {
        this.basket.items = [];
        this.basket.total = 0;
        this.events.emit('basket:change');

    }


    setPaymentMethod(method: TPaymentMethod) {}

    setOrderField(field: keyof TOrderForm, value: string) {}

    validateOrder() {}
}