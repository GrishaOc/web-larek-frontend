import { IformSuccessful } from "../../types";
import { ensureElement } from "../../utils/utils";
import { component } from "../base/component";

interface ISuccessActions {
	onClick: (event: MouseEvent) => void;
}

export class SuccessForm extends component<IformSuccessful> {
	protected _button: HTMLButtonElement;
	protected _result: HTMLElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ISuccessActions
	) {
		super(container);
		this._button = ensureElement<HTMLButtonElement>(
			`.${blockName}__close`,
			container
		);
		this._result = ensureElement<HTMLElement>(
			`.${blockName}__description`,
			container
		);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			}
		}
	}

	set description(value: number) {
		this.setText(this._result, 'Списано ' + value + ' синапсов');
	}
}