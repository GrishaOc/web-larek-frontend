import { IcontactDetails } from '../../types';
import { IEvents } from '../base/events';
import { form } from './form';

export class contactsForm extends form<IcontactDetails> {
	protected _phoneNumber: HTMLInputElement;
	protected _email: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._phoneNumber = container.elements.namedItem(
			'phone'
		) as HTMLInputElement;
		this._email = container.elements.namedItem('email') as HTMLInputElement;
	}

	clear() {
		this._phoneNumber.value = '';
		this._email.value = '';
	}
}

