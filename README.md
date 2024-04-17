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

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Архитектура кода
В проекте используется принцип MVP(Model-View-Presenter)
MVP(Model-View-Presenter) - обеспечивает четкое разделение ответственностей между классами Model и View каждый класс выполняет свою определенную роль
<table>
    <thead>
        <tr>
            <th>№</th>
            <th>Компонент</th>
            <th>Описание</th>
            <th>Базовый класс</th>
            <th>Связанный класс</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>Model</td>
            <td>Модель данных</td>
            <td>Model</td>
            <td>
                <ul>
                    <li>AppState</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>2</td>
            <td>View</td>
            <td>Модель отображения</td>
            <td>component</td>
            <td>
                <ul>
                    <li>BasketandBasketItem</li>
                    <li>card</li>
                    <li>contactsForm</li>
                    <li>form</li>
                    <li>modal</li>
                    <li>orderForm</li>
                    <li>page</li>
                    <li>success</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>3</td>
            <td>Presenter</td>
            <td>Модель связи</td>
            <td>-</td>
            <td>
                Реализуется в файле index.ts
            </td>
        </tr>
    </tbody>
</table>
## Типы данных
### interface IproductCard - Интерфейс описывающий карточки товара 
- `id: string` - идентификатор товара в магазине
- `name: string` - название товара
- `price: number | null` - цена товара
- `img: string` -  адрес картинки товара
- `category: string` - категория товара
- `description: string` - описание товара
- `added: boolean` - продукт добавлен

### interface Ipage - Интерфейс описывающий страницу 
- `counter:number` - счетчик товаров в корзине 
- `catalog:HTMLElement[]` - массив карточек товаров

### interface Ibasket - Интерфейс описывающий корзину
- `products:HTMLElement[]` - массив товаров
- `result:number` - итовая ценна вех товаров

### interface IproductCardBasket extends IproductCard - Интерфейс описывающий товары в корзине 
- `number:number` - номер товара в корзине 

### interface IformDelivery - Интерфейс описывающий  форму доставки 
- `address:string` - адрес доставки 
- `methodPay:string` - способ оплаты 

### interface IcontactDetails - Интерфейс описывающий контакты покупателя 
- `email:string` - почта покупателя 
- `phone:string` - телефон покупателя 

### interface IformSuccessful - Интерфейс описывающий успешную покупку
- `id:string` - айди заказа
- `result:number` - сумма заказа

### interface IformSuccessful - Интерфейс описывающий форму успешной покупки
- `result:number` - количество списанных средств

### interface IvalidOreder - Интерфейс использующийся для валидации полей при оформлении заказа
- `errormessage:string[]` - сообщение об ошибке 
- `error:boolean` - есть ли ошибка или нету
- `phone:string` - телефон покупателя
- `email:string` - почта покупателя
- `address:string` - адрес доставки
- `methodPay:string` - способ оплаты

### interface IorderInfo - Интерфейс описывающий информацию о заказе 
- `items:string[]` - массив идентификаторов купленных товаров
- `methodPay:string` - способ оплаты 
- `result:number` - сумма заказа
- `adress:string` - адрес доставки 
- `phone:string` - телефон покупателя
- `email:string` - почта покупателя

### interface IstatusApp - Интерфейс описывающий статус приложения 
- `catalog:IproductCard[]` - каталог товаров
- `basket:IproductCard[]` - корзина
- `order:IorderInfo|null` - заказ
- `setCatalog(items: IproductCard[]): void` - устанавливаем каталог товаров
- `addToBasket(product: IproductCard): void` - добавление в корзину 
- `removeFromBasket(product:IproductCard):void` - удаление из корзины
- `getResultBasketPrice():number` - получение итоговой суммы 

## Базовый код

### class Api - класс содержащий базовую логику отправки запроса. В конструкторе передается базовый адрес сервера и опциональный обьтект с запросами

#### Конструктор class Api

- constructor(baseUrl: string, options: RequestInit = {})

#### Методы class Api

- `get` - получение данных
- `post` - отправка данных
- `handleResponse` - обрабатывает ответ с сервера

### class EventEmitter - реализуются паттерн "Observer" , что позволяет подписываться на все события и уведомлять подписчиков о наступление события 

#### Конструктор class EventEmitter - включающий события

- constructor() {this._events = new Map<EventName, Set<Subscriber>>();}

#### Методы class EventEmitter

- `on` - Установить обработчик на событие
- `off` - Снять обработчик с события
- `emit` - Инициировать событие с данными
- `onAll` - Слушать все события
- `offAll` - Сбросить все обработчики
- `trigger` - Сделать коллбек триггер, генерирующий событие при вызове

### class component - Базовый класс, который реализует элементы работы(перекелючние классов,смена статуса блокировки,скрытие элемента и так далее)

### class model - Базовый класс для компонентов модели данных. Связывает переданные данные со свойствами объекта и активирует вызов именованных событий через метод emitChanges 

## Прочие вспомогательные классы

### class WeblarekAPI - класс взаимодействует с API-сервером. Позволяет получить список карточек с сервера и информацию по каждой карточке

#### Методы class WeblarekAPI

- `getProductId` - получение ID товара
- `getProductList` - получение списка товара
- `createOrder` - создание заказа
