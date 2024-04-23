import { IDeliveryForm } from "../types";
import { IEvents } from "./base/events";
import { Form } from "./common/Form";

export class DeliveryForm extends Form<IDeliveryForm>{
    protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;
	protected _address: HTMLInputElement;

    constructor(container:HTMLFormElement,protected divName:string,protected evt:IEvents){
        super(container,evt)

        this._card = container.elements.namedItem('card') as HTMLButtonElement;
        this._cash = container.elements.namedItem('cash') as HTMLButtonElement;
        this._address = container.elements.namedItem('address') as HTMLInputElement;

        if(this._cash){
            this._cash.addEventListener('click',()=>{
                this._cash.classList.add('button_alt-active')
                this._card.classList.remove('button_alt-active')
                this.inputChange('payment','cash')
            })
        }

        if(this._card){
            this._card.addEventListener('click',()=>{
                this._card.classList.add('button_alt-active')
                this._cash.classList.remove('button_alt-active')
                this.inputChange('payment','card')
            })
        }
    }
    clear(){
        this._cash.classList.remove('button_alt-active');
        this._card.classList.remove('button_alt-active');
		this._address.value = '';
    }
}