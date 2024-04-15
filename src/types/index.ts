interface IproductCard{
    id:string;
    name:string;
    price: number|null;
    img:string;
    category:string;
    description:string;
    added:boolean;
}
interface Ipage{
    counter:number;
    catalog:HTMLElement[];
}
interface Ibasket{
    products:HTMLElement[];
    result:number;
}
interface IproductCardBasket extends IproductCard{
    number:number;
}
interface IformDelivery{
    adress:string;
    methodPay:string;
}
interface IcontactDetails{
    email:string;
    phone:string;
}
interface IorderSuccessful{
    id:string;
    result:number;
}
interface IformSuccessful{
    result:number;
}
interface IvalidOreder{
    errormessage:string[];
    error:boolean;
    phone: string;
	email: string;
	address: string;
	methodPay: string;
}
interface IorderInfo{
    items:string[];
    methodPay:string;
    result:number;
    adress:string;
    phone:string;
    email:string;
}
interface IstatusApp{
    catalog:IproductCard[];
    basket:IproductCard[];
    order:IorderInfo|null;
    setCatalog(items: IproductCard[]): void;
    addToBasket(product: IproductCard): void;
    removeFromBasket(product:IproductCard):void;
    getResultBasketPrice():number;
}