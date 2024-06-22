import { IProduct } from "../types/api.type";
import { CategoryClassNames } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _category?: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._button = container.querySelector('.card__button');
        this._description = container.querySelector('.card__description');
        this._image = container.querySelector('.card__image'); 
        this._category = container.querySelector('.card__category');

        if(actions?.onClick) {
            if(this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        } 
    }
    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return  this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent;
    }

    set price(value: number | null) {
        if(value) {
            this.setText(this._price, `${value} синапсов`);
        } else {
            this.setText(this._price, 'Бесценно');
        }

        if(this._button) this._button.disabled = !value;
        
     }

    set category(value: string) {
        if(value) {
            this.setText(this._category, value);
            this._category?.classList.add(CategoryClassNames[value.toLowerCase()]);
        }
    }

    set image(src: string) {
        this.setImage(this._image, src, this.title);
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set button(value: string) {
        this.setText(this._button, value);
    }

}