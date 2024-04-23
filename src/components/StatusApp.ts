import { ICards, IOrder, IStatusApi, IValid } from "../types";
import { Model } from "./base/Model";

export class Product extends Model<ICards> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	status: boolean;
	price: number | null;
	selected: boolean;
}
type messageErore = Partial<Record<keyof IOrder, string>>;

export class StatusApp extends Model<IStatusApi> {
	basket: Product[] = [];
	catalog: Product[] = [];
	order: IOrder = this.getEmptyOrder();
	messageErore: messageErore = {};

	setCatalog(items: ICards[],template: string) {
		this.catalog = items.map((item) => new Product(item, this.evt));
		this.emitChanges('catalog:changed', { catalog: this.catalog });
	}

	addToBasket(product: Product) {
		this.basket.push(product);
	}

	removeFromBasket(product: Product) {
		this.basket = this.basket.filter((item) => item.id !== product.id);
	}

	getTotalBasketPrice() {
		let total = 0;
		this.basket.forEach((item) => {
			total = total + item.price;
		});

		return total;
	}

	getEmptyOrder(): IOrder {
		return {
			payment: '',
			address: '',
			email: '',
			phone: '',
			items: [],
			total: 0,
		};
	}

	getCountProductInBasket() {
		return this.basket.length;
	}

	setOrderFields(field: keyof IValid, value: string) {
		this.order[field] = value;

		if (!this.validateOrder()) {
			return;
		}

		if (!this.validateContacts()) {
			return;
		}
	}
	validateOrder(): boolean {
		const errors: typeof this.messageErore = {};

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}

		this.messageErore = errors;

		this.evt.emit('orderFormErrors:change', this.messageErore);

		return Object.keys(errors).length === 0;
	}
	validateContacts(): boolean {
		const errors: typeof this.messageErore = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.messageErore = errors;
		this.evt.emit('contactsFormErrors:change', this.messageErore);

		return Object.keys(errors).length === 0;
	}

	selected(): void {
		this.order.items = this.basket.map((product) => product.id);
	}

	clearBasket(): void {
		this.basket = [];
	}

	resetSelected(): void {
		this.catalog.forEach((product) => {
			product.selected = false;
		});
	}

	clearOrder(): void {
		this.order = this.getEmptyOrder();
	}
}