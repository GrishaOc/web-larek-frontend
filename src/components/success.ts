import { ISuccessDoing, ISuccessForm } from "../types";
import { Component } from "./base/component";

export class success extends Component<ISuccessForm>{
    protected _description:HTMLElement
    protected _button:HTMLButtonElement

    constructor(container:HTMLElement,divName:string,doing?:ISuccessDoing){
        super(container)
        this._description = container.querySelector(`${divName}__description`)
        this._button = container.querySelector(`${divName}__button`)

        if (doing?.onClick){
            if (this._button) {
                this._button.addEventListener('click',doing.onClick)
            }
        }
    }
    set description(value:number){
        this.setText(this._description, "Списано" + value + "Синапсов")
    }
}