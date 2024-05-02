import { ICards, IOrder, IStatusApi } from "../types/index";
import { Model } from "./base/model";

type messageErore = Partial<Record<keyof IOrder, string>>;
interface IValid{
	phone:string;
    email:string;
	address:string;
    payment:string;
}

export class StatusApp extends Model<IStatusApi> {
	catalog: ICards[];
	basket: ICards[] = [];
	order: IOrder = this.getEmptyOrder();
	messageErore: messageErore = {};

	setCatalog(items: ICards[]) {
		this.catalog = items;
		this.emitChanges('items:changed');
	}

	toBasket(item: ICards) {
		this.basket.push(item);
	}

	removeFromBasket(cards: ICards) {
		this.basket = this.basket.filter((item) => item.id !== cards.id);
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

		this.evt.emit('orderErrors:change', this.messageErore);

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
		this.evt.emit('contactsErrors:change', this.messageErore);

		return Object.keys(errors).length === 0;
	}

	selected(): void {
		this.order.items = this.basket.map((items) => items.id);
	}

	clearBasket(): void {
		this.basket = [];
	}

	resetSelected(): void {
		this.catalog.forEach((items) => {
			items.selected = false;
		});
	}

	clearOrder(): void {
		this.order = this.getEmptyOrder();
	}
}