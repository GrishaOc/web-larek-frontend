import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IModal{
    content:HTMLElement;
}



export class Modal extends Component<IModal>{
    protected _closeButton:HTMLButtonElement;
    protected _content:HTMLElement;

    constructor(container:HTMLElement,protected evt:IEvents){
        super(container)

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close',container)
        this._content = ensureElement<HTMLElement>('modal__content',container)
        this._closeButton.addEventListener('click',this.remove.bind(this))
        this._content.addEventListener('click',(evt)=>evt.stopPropagation)
        this.container.addEventListener('click',this.remove.bind(this))
    }

    set content(value:HTMLElement){
        this._content.replaceChildren(value)
    }
    remove(){
        this.container.classList.remove('modal__active')
        this.content = null
    }
    open(){
        this.container.classList.add('modal__active')
        this.evt.emit('modal:open')
    }
    render(data:IModal):HTMLElement{
        super.render(data)
        this.open()
        return this.container
    }
}