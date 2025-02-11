# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

## Сборка

```
npm run build
```

## Архитектура приложения

- src/docs/scheme.drawio

Код приложения разделен на слои: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Component
Является базовым классом для компонентов интерфейса. 
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.
В поле container хранит ссылку на DOM элемент за отображение, которого он отвечает. 
Главный метод класса -  `render`. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.
Так же класс Component содержит утилитарные методы `setText` и `setImage` для модификации DOM-элементов

#### Класс View
Используется для компонентов интерфейса, которые могут генерировать события. Наследуется от класса `Component` и расширяет его, добавляя поле `events`, в которое записывается брокер событий, с помощью методов которого возможно генерировать события.

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
`get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
`post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления. 
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие   

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных и наследуются от класса `Component` или от класса `View`.

#### Класс Basket
Отвечает за отображение корзины товаров - списка товаров в корзине (`items: HTMLElement[]`) и суммарной стоимости товаров (`total: number`).

#### Класс Form
Базовый класс, отвечающий за работу с формами. Обрабатывает события ввода данных в поля формы и генерирует при этом событие. Так же отвечает за отображение ошибки валидации данных в форме и состояние активности кнопки отправки, в зависимости от текущего состояния валидности формы. Так же генерирует событие при отправке формы. Название события включает в себя имя формы, например:
- `contacts:submit` - событие, генерируемое при отправке формы с контактными данными
- `order:submit` - событие, генерируемое при отправке формы со способом платежа и адресом

#### Классы Contacts и Order
Наследуются от класса Form и добавляют управление отображением элементов формы - полей ввода и переключателя способы оплаты в случае Order.

#### Класс Modal
Реализует модальное окно в котором может отображаться какое либо содержимое (`content: HTMLElement`). Так же предоставляет методы `open` и `close` для управления отображением модального окна 

#### Класс Success
Отвечает за отображение содержимого модального окна успешного выполнения заказа.

#### Класс Card
Отвечает за отображение описания товара, задавая в карточке товара данные заголовка, изображения, стоимости, описания, категории товара. Класс используется для отображения карточек товарах в разных местах на странице (в каталоге товаров на главной, в модальном окне товара, в списке товаров добавленных в корзину). Но при этом в конструктор класса передается DOM элемент созданный на основе разных HTML шаблонов. 
Так же класс отвечает за взаимодействие с карточкой генерируя событие `card:select` при клике на ней (для каталога товаров на главной) или обрабатывает клик на кнопке внутри карточки товара (для корзины и модального окна описания товара)

#### Класс Page
Отвечает за отображение главной страницы - каталог товаров и счетчик добавленных в корзину товаров, а так же за блокировку скрола при открытии модального окна.
Генерирует событие `basket:open` при клике на кнопку корзины.

### Модель данных
Класс AppData отвечает за хранение и логику работы с данными приложения. 
В полях класса хранятся следующие данные:
- массив товаров каталога
- открытый в текущий момент в модальном окне товар
- массив товаров добавленных в корзину
- суммарная стоимость товаров добавленных в корзину
- данные заказа - данные полей форм и список товаров в заказе
- данные валидации форм
Так же класс предоставляет набор методов для взаимодействия с этими данными.

Класс принимает в конструкторе экземпляр брокера событий и генерирует следующие события при изменении данных:
- `items:change` - изменение массива товаров каталога
- `preview:change` - изменение открываемого в модальном окне товара
- `basket:change` - изменение списка товаров корзины
- `order:ready` - данные форм оформления заказа валидны
- `formErrors:change` - изменение ошибки валидации форм

### Класс WebLarekAPI
Наследуется от класса Api и добавляет методы `getProductItem`, `getProductList`, `orderProducts` реализующие взаимодействие с бэкендом сервиса.

## Презентер (Взаимодействие компонентов)
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`
Взаимодействие осуществляется за счет событий проходящих в брокер событий и отслеживании этих событий.
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*
*События изменения данных модели (генерируются классом AppData)*
- `items:change` - изменение массива товаров каталога
- `preview:change` - изменение открываемого в модальном окне товара
- `basket:change` - изменение списка товаров корзины
- `order:ready` - данные форм оформления заказа валидны
- `formErrors:change` - изменение ошибки валидации форм
*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `order:open` - открытие модального окна с формой оформления заказа
- `basket:open` - открытие модального окна корзины
- `card:select` - открытие описания товара в модальном окне
- `^order\..*:change` - изменение данных в форме с данными заказа
- `^contacts\..*:change` - изменение полей ввода в форме контактных данных
- `contacts:submit` - отправка формы контактных данных пользователя в модальном окне заказа
- `order:submit` - событие, генерируемое при отправке формы со способом платежа и адресом
- `modal:open` - открытие любого модального окна
- `modal:close` - закрытие любого модального окна

Например, в `index.ts` описывается, что при событии изменения списка товаров в корзине (`.on('basket:change'`) необходимо обновить значение счетчика элементов в корзине, перерисовать список элементов в корзине, и обновить отображаемую суммарную стоимость товаров в корзине.
