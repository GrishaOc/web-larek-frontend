import { component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { IproductCard } from '../../types';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}
export class card extends component<IproductCard> {
	private _category: HTMLElement;
	private _title: HTMLElement;
	private _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	private _button?: HTMLButtonElement;
	private _price?: HTMLElement;

    categoryMapping: { [key: string]: string } = {
		'софт-скил': 'card__category_soft',
		другое: 'card__category_other',
		'хард-скил': 'card__category_hard',
		дополнительное: 'card__category_additional',
		кнопка: 'card__category_button',
	};

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._category = ensureElement<HTMLElement>(
			`.${blockName}__category`,
			container
		);
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);
		this._button = container.querySelector(`.${blockName}__button`);
		this._description = container.querySelector(`.${blockName}__text`);
		this._price = container.querySelector(`.${blockName}__price`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set category(value: string) {
		this.setText(this._category, value);

		this._category.className = '';
		const mainClass = `${this.blockName}__category`;
		const additionalClass = this.categoryMapping[value];
		this._category.classList.add(mainClass, `${mainClass}_${additionalClass}`);
	}

	set name (value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		this.setIMG(this._image, value, this.name);
	}

	set price(value: number |null) {
		this.setText(this._price, value ? `${value.toString()} синапсов` : 'Бесценно');
	}
    
    get price(): number {
		return Number(this._price.textContent) || 0;
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set button(value: string) {
		if (this._price.textContent === 'Бесценно') {
			this._button.disabled = true;
			this.setText(this._button, 'Нельзя купить');
		} else this.setText(this._button, value);
	}

	set selected(value: boolean) {
		this.updateButton(value);
	}

	updateButton(selected: boolean) {
		if (selected) {
			this.button = 'Убрать из корзины';
		} else {
			this.button = 'В корзину';
		}
	}
}

export class CardPreview extends card {
	protected _description: HTMLElement;
	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
		this._description = container.querySelector(`.${this.blockName}__text`);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}
}