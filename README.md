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