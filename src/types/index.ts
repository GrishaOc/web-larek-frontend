export interface ICards{
    id:string;
    title:string;
    image:string;
    description:string;
    selected:boolean;
    category:string;
    price:number|null;
}

export interface IOrder{
    payment:string;
    total:number;
    address:string;
    phone:string;
    email:string;
    items:string[];
}

export interface IDeliveryForm{
    payment:string;
    address:string;
}

export interface IContacntForm{
    email:string;
    phone:string;
}

export interface IPage{
    counter:number;
    catalog:HTMLElement[];
    locked:boolean;
}
export interface IStatusApi{
    catalog:ICards[];
    order:IOrder|null;
    basket:ICards[];
    setCatalog(items: ICards[]): void;
	addToBasket(product:ICards): void;
	removeBasket(product: ICards): void;
	getResultBasket(): number;
}
export interface IValidDelivery{
    address:string;
    payment:string;
}
export interface IValidContact{
    phone:string;
    email:string;
}
export interface IValid{
    address:string;
    payment:string;
    phone:string;
    email:string
}
export interface ApiResponse {
    items: ICards[];
  }

export interface IdoingBasket {
    onClick: (event: MouseEvent) => void;
}
export interface ISuccessForm{
    description: number;
}
export interface ISuccessDoing{
    onClick: (event: MouseEvent) => void;
}
export interface ISuccessfulOrder{
    id:string;
    total:number;
}