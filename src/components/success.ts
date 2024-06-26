import { ISuccessDoing, ISuccessForm } from "../types/index";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/component";

export class Success extends Component<ISuccessForm> {
	protected _button: HTMLButtonElement;
	protected _description: HTMLElement;

	constructor(
		protected blockName: string,container: HTMLElement,doing?: ISuccessDoing) {
		super(container);

		this._button = ensureElement<HTMLButtonElement>(`.${blockName}__close`,container);
		this._description = ensureElement<HTMLElement>(`.${blockName}__description`,container);

		if (doing?.onClick) {
			if (this._button) {
				this._button.addEventListener('mousedown', doing.onClick);
			}
		}
	}

	set description(value: number) {
		this.setText(this._description, 'Списано ' + value + ' синапсов');
	}
}