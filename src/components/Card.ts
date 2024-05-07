import { ICards } from '../types/index';
import { ensureElement } from '../utils/utils';
import { Component } from './base/component';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICards> {
	protected _image: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _description: HTMLElement;
	protected _button?: HTMLButtonElement;

	Category: { [key: string]: string } = {'софт-скил': 'card__category_soft',
    другое: 'card__category_other','хард-скил': 'card__category_hard',
		дополнительное: 'card__category_additional',
		кнопка: 'card__category_button',
	};

	constructor(
		protected divName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);
		this._image = ensureElement<HTMLImageElement>(
			`.${divName}__image`,
			container
		);
		this._title = ensureElement<HTMLElement>(`.${divName}__title`, container);
		this._category = ensureElement<HTMLElement>(
			`.${divName}__category`,
			container
		);
		this._price = container.querySelector(`.${divName}__price`);
		this._description = container.querySelector(`.${divName}__description`);
		this._button = container.querySelector(`.${divName}__button`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('mousedown', actions.onClick);
			} else {
				container.addEventListener('mousedown', actions.onClick);
			}
		}
	}
	set id(value: string) {
		this.container.dataset.id = value;
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.classList.add(this.Category[value]);
	}

	set price(value: number | null) {
		this.setText(
			this._price,
			value ? `${value.toString()} синапсов` : 'Бесценно'
		);
		if (value === null && this._button) {
			this._button.disabled = true;
			this.setText(this._button, 'Нельзя купить');
		}
	}

	get price(): number {
		return Number(this._price.textContent) || 0;
	}

	set description(value: string) {
		this.setText(this._description, value);
	}
	set button(value: string) {
		this.setText(this._button, value);
	}

	set selected(value: boolean) {
		this.updateButton(value);
	}

	updateButton(selected: boolean) {
		if (!selected) {
			this.button = 'В корзину';
		} else {
			this.button = 'убрать из корзины';
		}
	}
}

export class ViewCard extends Card {
	protected _description: HTMLElement;
	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
		this._button
		this._description = container.querySelector(`.${this.divName}__text`);
	}
	set description(value: string) {
		this.setText(this._description, value);
	}
}