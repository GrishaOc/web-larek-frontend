import { Ibasket, IproductCardBasket} from '../../types';
import { component } from '../base/component'; 
import { IEvents } from '../base/events';

export class Basket extends component<Ibasket> {
	protected _products: HTMLElement;
	protected _result: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(protected blockName: string,container: HTMLElement,protected events: IEvents) {
		super(container);

		this._button = container.querySelector(`.${blockName}__button`);
		this._result = container.querySelector(`.${blockName}__price`);
		this._products = container.querySelector(`.${blockName}__list`);

		if (this._button) {
			this._button.addEventListener('click', () =>
				this.events.emit('basket:order')
			);
		}
	}

	set total(price: number) {
		this.setText(this._button, price + ' синапсов');
	}

	set list(items: HTMLElement[]) {
		this._result.replaceChildren(...items);
		this.toggleButton(items.length ? false : true);
	}

	toggleButton(isDisabled: boolean) {
		this._button.disabled = isDisabled;
	}

	updateIndices() {
		Array.from(this._result.children).forEach((item, index) => {
			const indexInItem = item.querySelector(`.basket__item-index`);
			if (indexInItem) {
				indexInItem.textContent = (index + 1).toString();
			}
		});
	}
}

export interface IActionsProductItemBasket {
	onClick: (event: MouseEvent) => void;
}

export class ProductItemBasket extends component<IproductCardBasket> {
	protected _number: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: IActionsProductItemBasket
	) {
		super(container);
		this._title = container.querySelector(`.${blockName}__title`);
		this._number = container.querySelector(`.basket__item-index`);
		this._price = container.querySelector(`.${blockName}__price`);
		this._button = container.querySelector(`.${blockName}__button`);

		if (this._button) {
			this._button.addEventListener('click', (evt) => {
				this.container.remove();
				actions?.onClick(evt);
			});
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set index(value: number) {
		this.setText(this._number, value);
	}

	set price(value: number) {
		this.setText(this._price, value + ' синапсов');
	}
}