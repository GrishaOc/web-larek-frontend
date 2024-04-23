import { Api, ApiListResponse } from './base/api';
import { ICards, IOrder, ISuccessfulOrder } from '../types/index';

interface IWebLarekApi {
	getCardsId: (id: string) => Promise<ICards>;
	getOrder: (order: IOrder) => Promise<ISuccessfulOrder>;
	getCards: () => Promise<ICards[]>;
}

export class WebLarekApi extends Api implements IWebLarekApi {
	readonly cdn: string;
	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}
	getCards(): Promise<ICards[]> {
		return this.get('/product').then((data: ApiListResponse<ICards>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}
	getCardsId(id:string): Promise<ICards>{
		return this.get(`/product/${id}`).then((item:ICards)=>({...item,image:this.cdn + item.image,}))
	}
	getOrder(order:IOrder):Promise<ISuccessfulOrder>{
		return this.post('/order', order).then((result: ISuccessfulOrder) => ({
			id:result.id,
			total:result.total
		}));
	}
}
