import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

interface IForm{
    valid:boolean
    errors:string[];
}

export class Form<T> extends Component<IForm>{
    protected _errors:HTMLElement;
    protected _submit:HTMLButtonElement;

    constructor(protected container:HTMLFormElement,protected evt:IEvents){
        super(container)

        this.container.addEventListener('input',(e:Event)=>{
            const target = e.target as HTMLInputElement
            const value = target.value
            const cell = target.name as keyof T
            this.inputChange(cell, value);
        })
        this.container.addEventListener('submit',(e:Event)=>{
			e.preventDefault();
			this.evt.emit(`${this.container.name}:submit`);
        })
        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]',this.container)
        this._errors = ensureElement<HTMLElement>('.form__errors',this.container)
    }
    protected inputChange(cell:keyof T,value:string){
        this.evt.emit(`${this.container.name}.${String(cell)}:change`,{
            cell,value,
        })
    }
    set valid(value:boolean){
        this._submit.disabled= !value
    }
    set errors(value:string){
        this.setText(this._errors,value)
    }

    render(state:Partial<T>&IForm){
        const{valid,errors,...inputs} = state
        super.render({valid,errors})
        Object.assign(this,inputs)
        return this.container
    }
}