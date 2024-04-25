import { ICards, IdoingBasket } from "../types";
import { Component } from "./base/component";
import { IEvents } from "./base/events";

interface IBasket{
    list:HTMLElement[];
    total:number|null;
}
export class Basket extends Component<IBasket>{
    protected _list:HTMLElement;
    protected _price: HTMLElement;
    protected _button:HTMLButtonElement;

    constructor(container:HTMLElement,protected evt: IEvents,divName:string){
        super(container)

        this._list = container.querySelector(`.${divName}__list`)
        this._price = container.querySelector(`.${divName}__price`)
        this._button = container.querySelector((`.${divName}__button`))

        if (this._button) {
            this._button.addEventListener('click',()=>this.evt.emit('basket:order'))
        }
    }
    set total(price:number|null){
        this.setText(this._button,price + 'Синапсов')
    }

    set list(items:HTMLElement[]){
        this._list.replaceChildren(...items)
        this._button.disabled = items.length?false:true
    }
    disableBTN() {
        this._button.disabled = true
      }
}

interface IproductInbasket extends ICards{
    index:number;
}
export class ProductInBasket extends Component<IproductInbasket>{
    protected _title:HTMLElement;
    protected _index:HTMLElement;
    protected _price:HTMLElement;
    protected _button:HTMLButtonElement;

    constructor(protected divName:string,container:HTMLElement,doing?:IdoingBasket){
        super(container)

        this._title = container.querySelector(`${divName}__title`);
        this._index = container.querySelector('.basket__item-index__index')
        this._price = container.querySelector(`${divName}__price`)
        this._button = container.querySelector(`${divName}__button`)

        if(this._button){
            this._button.addEventListener('click',(evt)=>{
                this.container.remove()
                doing?.onClick(evt)
            })
        }
    }
    set index(value:number){
        this._index.textContent = value.toString()
    }
    set price(value:number){
        this.setText(this._price,value + 'Синапсов')
    }

    set title(value:string){
        this.setText(this._title,value)
    }
}