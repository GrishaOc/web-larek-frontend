import './scss/styles.scss';

import { WeblarekAPI } from './components/WeblarekAPI';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppState, Product } from './components/Model/AppState';
import { page } from './components/views/page';
import { Modal } from './components/views/modal';
import { Basket, ProductItemBasket } from './components/views/BasketandBasketItem';
import { orderForm } from './components/views/orderForm';
import { contactsForm } from './components/views/contactsForm';
import { SuccessForm } from './components/views/success';
import { CardPreview, card } from './components/views/card';
import { IcontactDetails, IformDelivery, IformSuccessful, IorderSuccessful, IvalidOreder } from './types';

const api = new WeblarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();
const appData = new AppState({}, events);

const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const PreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');

const Page = new page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket('basket', cloneTemplate(basketTemplate), events);
const OrderForm = new orderForm(
	'order',
	cloneTemplate(orderFormTemplate),
	events
);
const ContactsForm = new contactsForm(cloneTemplate(contactsTemplate), events);
const successForm = new SuccessForm(
	'order-success',
	cloneTemplate(successTemplate),
	{
		onClick: () => modal.close(),
	}
);

events.on('catalog:changed', () => {
	Page.catalog = appData.catalog.map((product) => {
		const Card = new card('card', cloneTemplate(catalogTemplate), {
			onClick: () => events.emit('card:select', product),
		});
		return Card.render({
			title: product.title,
			image: product.image,
			price: product.price,
			category: product.category,
		});
	});
});

events.on('card:select', (product: Product) => {
	Page.locked = true;
	const productItemPreview = new CardPreview(
		cloneTemplate(PreviewTemplate),
		{
			onClick: () => {
				if (product.added) {
					events.emit('basket:removeFromBasket', product);
				} else {
					events.emit('card:addToBasket', product);
				}
				productItemPreview.updateButton(product.added);
			},
		}
	);
	modal.render({
		content: productItemPreview.render({
			id: product.id,
			title: product.title,
			image: product.image,
			category: product.category,
			description: product.description,
			price: product.price,
			added: product.added,
		}),
	});
});

events.on('card:addToBasket', (product: Product) => {
	appData.addToBasket(product);
	product.added = true;
	Page.counter = appData.getCountProductInBasket();
});

events.on('basket:removeFromBasket', (product: Product) => {
	appData.removeFromBasket(product);
	product.added = false;
	basket.total = appData.getTotalBasketPrice();
	Page.counter = appData.getCountProductInBasket();
	basket.updateIndices();
	if (appData.getCountProductInBasket() == 0) {
		basket.toggleButton(true);
	}
});

events.on('basket:open', () => {
	Page.locked = true;
	const basketItems = appData.basket.map((item, number) => {
		const productItem = new ProductItemBasket(
			'card',
			cloneTemplate(cardBasketTemplate),
			{
				onClick: () => events.emit('basket:removeFromBasket', item),
			}
		);
		return productItem.render({
			title: item.title,
			price: item.price,
			number: number + 1,
		});
	});
	modal.render({
		content: basket.render({
			products: basketItems,
			result: appData.getTotalBasketPrice(),
		}),
	});
});

events.on('basket:order', () => {
	modal.render({
		content: OrderForm.render({
			adress: '',
			methodPay: '',
			valid: false,
			errors: [],
		}),
	});
});

api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((error) => {
		console.log(error);
	});

events.on('modal:close', () => {
	Page.locked = false;
});

events.on(
	'orderInput:change',
	(data: { field: keyof IformDelivery; value: string }) => {
		appData.setFieldsOrder(data.field, data.value);
	}
);

events.on('orderFormErrors:change', (errors: Partial<IvalidOreder>) => {
	const { methodPay, adress } = errors;
	OrderForm.valid = !methodPay && !adress;
	OrderForm.errors = Object.values({ methodPay, adress })
		.filter((i) => !!i)
		.join('; ');
});

events.on('order:submit', () => {
	appData.order.result = appData.getTotalBasketPrice();
	appData.addProductsOrder();
	modal.render({
		content: ContactsForm.render({
			valid: false,
			errors: [],
		}),
	});
});

events.on('contactsFormErrors:change', (errors: Partial<IcontactDetails>) => {
	const { email, phone } = errors;
	ContactsForm.valid = !email && !phone;
	ContactsForm.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on('contacts:submit', () => {
	api
		.createOrder(appData.order)
		.then((res) => {
			events.emit('order:success', res);
			appData.clearBasket();
			appData.clearOrder();
			Page.counter = 0;
			appData.resetSelected();
			OrderForm.clear();
			ContactsForm.clear();
		})
		.catch((err) => {
			console.log(err);
		});
});

events.on('order:success', (res: IformSuccessful) => {
	modal.render({
		content: successForm.render({
			result: res.result,
		}),
	});
});
