import { IEvents } from "./events";

export abstract class component<T>{
    protected constructor(protected readonly container:HTMLElement){}

    toggleClass(element:HTMLElement, className:string, action?:boolean):void {
        element.classList.toggle(className,action);
    }
    
    protected setText(element:HTMLElement,value:unknown):void{
        if(element){
            element.textContent = String(value)
        }
    }

    protected setHidden(element:HTMLElement):void{
        element.style.display = 'none'
    }

    protected setVisable(element:HTMLElement):void{
        element.style.removeProperty('display')
    }

    protected setIMG(element:HTMLImageElement,src?:string,alt?:string):void{
        if(element){
            element.src = src
        }
        if(element){
            element.alt = alt
        }
    }
    setDisable(element:HTMLElement,state:boolean){
        if(element){
            if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
        }
    }
    render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
