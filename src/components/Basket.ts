import { IBasket } from "../types/basket.type";
import { cloneTemplate, createElement, ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { View } from "./common/View";

export class Basket extends View<IBasket> {
    static template = ensureElement<HTMLTemplateElement>('#basket');
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(events: IEvents) {
        super(events, cloneTemplate(Basket.template));

        this._list = this.container.querySelector('.basket__list');
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if(this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            })
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if(items.length) {
            this._list.replaceChildren(...items);
            this.setDisabled(this._button, false);
        } else {
            this._list.replaceChildren(
                createElement<HTMLParagraphElement>('p', {
                    textContent: 'Корзина пуста'
                })
            );
            this.setDisabled(this._button, true);
        }
    }

    set selected(items: string[]) {
        if(items.length) {
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
        }
    } 

    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }

}