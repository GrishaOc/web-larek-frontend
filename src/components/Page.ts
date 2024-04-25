import { IPage } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/component";
import { IEvents } from "./base/events";


export class Page extends Component<IPage>{
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _basket: HTMLButtonElement;
    protected _scroll:HTMLElement

    constructor(container:HTMLElement,protected evt:IEvents){
        super(container)
        this._counter = ensureElement<HTMLElement>('.header__basket-counter')
        this._catalog = ensureElement<HTMLElement>('.gallery')
        this._basket = ensureElement<HTMLButtonElement>('.header__basket')
        this._basket.addEventListener('click',()=>{
            this.evt.emit('basket:open')
        })
    }

	set Counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set Catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
    }
    set LockScroll(value:boolean){
        if (value) {
            this._scroll.classList.add('page_wrapper_locked')
        }else{
            this._scroll.classList.remove('page_wrapper_locked')
        }
    }
}