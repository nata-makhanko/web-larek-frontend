import './scss/styles.scss';

import { AppData } from './components/AppData';
import { Basket } from './components/Basket';
import { Card } from './components/Card';
import { Page } from './components/Page';
import { WebLarekAPI } from './components/WebLarekAPI';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { IProduct } from './types/api.type';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const api = new WebLarekAPI(CDN_URL, API_URL);

// Все шаблоны 
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const modalCard = ensureElement<HTMLElement>('#modal-container');

// Брокер событий
const events = new EventEmitter();

//Модель данных приложения
const appData = new AppData(events);

// Глобальные контейнеры
const page = new Page(events, document.body);
const modal = new Modal(events, modalCard);
const basket = new Basket(events);

//События
events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

events.on('card:select', (item: IProduct) => {
    appData.setPreview(item);
});

events.on('preview:change', (item: IProduct) => {
    const card = new Card(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if(appData.inBasket(item)) {
                appData.removeFromBasket(item);
                card.button = 'В корзину'
            } else {
                appData.addToBasket(item);
                card.button = 'Купить'
            }
        }
    });
    card.button = appData.inBasket(item) ? 'Купить' :  'В корзину';
    modal.render({content: card.render(item)});
});

events.on('basket:change', () => {
    page.counter = appData.basket.items.length;
    basket.items = appData.basket.items.map(id => {
        const item = appData.items.find(item => item.id === id);
        if(item) {
            const card = new Card(cloneTemplate(cardBasketTemplate), {
                onClick: () => appData.removeFromBasket(item),
            });
    
            return card.render(item);
        }

        return;
    });

    basket.total = appData.basket.total;
    
})

events.on('basket:open', () => {
    modal.render({
        content: basket.render(),
    })
})

events.on('order:open', () => {
    console.log('order:open');
})

events.on('items:change', (items: IProduct[]) => {
    page.catalog = items.map(item => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });

        return card.render(item);
    });

});

api.getProductList().then(appData.setItems.bind(appData)).catch(err => console.error(err));