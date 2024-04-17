import { Api, ApiListResponse } from "./base/api";
import { IproductCard,IorderInfo,IorderSuccessful } from "../types";

export interface IWeblarekAPI {
	getProductId: (id: string) => Promise<IproductCard>;
	getProductList: () => Promise<IproductCard[]>;
	createOrder: (order: IorderInfo) => Promise<IorderSuccessful>;
}

export class WeblarekAPI extends Api implements IWeblarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductId(id: string): Promise<IproductCard> {
		return this.get(`/product/${id}`).then((item: IproductCard) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	getProductList(): Promise<IproductCard[]> {
		return this.get('/product').then((data: ApiListResponse<IproductCard>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	createOrder(order: IorderInfo): Promise<IorderSuccessful> {
		return this.post('/order', order).then((total: IorderSuccessful) => ({
			id: total.id,
			result: total.result,
		}));
	}
}