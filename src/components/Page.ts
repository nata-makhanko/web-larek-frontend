import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { View } from "./common/View";

interface IPage {
    content: HTMLElement;
    catalog: HTMLElement[];
    locked: boolean
}

export class Page extends View<IPage> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);

        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        })
    }

    set counter(value: number) {
        this.setText(this._counter, value);
    };
    
    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    };

    set locked(value: boolean) {
        if(value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    };

}