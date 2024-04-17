import { FormErrors, IorderInfo, IproductCard, IstatusApp, IvalidOreder } from "../../types";
import { Model } from "../base/model";


export class Product extends Model<IproductCard> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	status: boolean;
	price: number | null;
	added: boolean;
}
export class AppState extends Model<IstatusApp> {
	basket:IproductCard[] = [];
	catalog: IproductCard[] = [];
	order: IorderInfo = this.getEmptyOrder();
	formErrors: FormErrors = {};

	setCatalog(items: IproductCard[]) {
		this.catalog = items.map((item) => new Product(item, this.events));
		this.makeChanges('catalog:changed', { catalog: this.catalog });
	}

	addToBasket(product: Product) {
		this.basket.push(product);
	}

	removeFromBasket(product: Product) {
		this.basket = this.basket.filter((item) => item.id !== product.id);
	}

	getTotalBasketPrice() {
		let result = 0;
		this.basket.forEach((item) => {
			result = result + item.price;
		});

		return result;
	}

	getEmptyOrder(): IorderInfo {
		return {
            items: [],
			methodPay: '',
            result: 0,
			adress: '',
            phone: '',
			email: '',
		};
	}

	getCountProductInBasket() {
		return this.basket.length;
	}

	setFieldsOrder(field: keyof IvalidOreder, value: string) {
		this.order[field] = value;

		if (!this.validateOrder()) {
			return;
		}

		if (!this.validateContact()) {
			return;
		}
	}

	validateOrder(): boolean {
		const errors: typeof this.formErrors = {};

		if (!this.order.adress) {
			errors.adress = 'Необходимо указать адрес';
		}
		if (!this.order.methodPay) {
			errors.methodPay = 'Необходимо выбрать способ оплаты';
		}

		this.formErrors = errors;

		this.events.emit('orderFormErrors:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}

	validateContact(): boolean {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}

	addProductsOrder(): void {
		this.order.items = this.basket.map((product) => product.id);
	}

	clearBasket(): void {
		this.basket = [];
	}

	resetSelected(): void {
		this.catalog.forEach((product) => {
			product.added = false;
		});
	}

	clearOrder(): void {
		this.order = this.getEmptyOrder();
	}
}