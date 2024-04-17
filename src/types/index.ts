export interface IproductCard{
    id:string;
    title:string;
    price: number|null;
    image:string;
    category:string;
    description:string;
    added:boolean;
}
export interface Ipage{
    counter:number;
    catalog:HTMLElement[];
    locked: boolean;
}
export interface Ibasket{
    products:HTMLElement[];
    result:number;
}
export interface IproductCardBasket extends IproductCard{
    number:number;
}
export interface IformDelivery{
    adress:string;
    methodPay:string;
}
export interface IcontactDetails{
    email:string;
    phone:string;
}
export interface IorderSuccessful{
    id:string;
    result:number;
}
export interface IformSuccessful{
    result:number;
}
export interface IvalidOreder{
    phone: string;
	email: string;
	adress: string;
	methodPay: string;
}
export interface IorderInfo{
    items:string[];
    methodPay:string;
    result:number;
    adress:string;
    phone:string;
    email:string;
}
export interface IstatusApp{
    catalog:IproductCard[];
    basket:IproductCard[];
    order:IorderInfo|null;
    setCatalog(items: IproductCard[]): void;
    addToBasket(product: IproductCard): void;
    removeFromBasket(product:IproductCard):void;
    getResultBasketPrice():number;
}
export interface IModal {
	content: HTMLElement;
}
export type FormErrors = Partial<Record<keyof IorderInfo, string>>