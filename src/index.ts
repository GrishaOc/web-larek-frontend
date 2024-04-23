import './scss/styles.scss';
import { Api, ApiListResponse } from './components/base/api';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { WebLarekApi } from './components/WebLarekAPI';
import { Product, StatusApp } from './components/StatusApp';
import { EventEmitter } from './components/base/events';
import { ICards, IContacntForm, IDeliveryForm, IValid } from './types';
import { Page } from './components/Page';
import { ViewCard } from './components/card/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { basketTemplate, cardBasketTemplate, cardCatalogTemplate, cardPreviewTemplate, contactsTemplate, successTemplate } from './components/templates';
import { Modal } from './components/common/Modal';
import { Basket, ProductInBasket } from './components/Basket';
import { DeliveryForm } from './components/DeliveryForm';
import { ContactsForm } from './components/ContactsForm';
import { success } from './components/success';

const evt = new EventEmitter();
const api = new WebLarekApi(API_URL, CDN_URL);
const statusData = new StatusApp({}, evt);
const page = new Page(document.body, evt);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), evt);
const basket = new Basket(cloneTemplate(basketTemplate),evt,'basket');
const order = new DeliveryForm(cloneTemplate(successTemplate),'order',evt)
const orderForm = new DeliveryForm(cloneTemplate(basketTemplate),'order',evt)
const contacts = new ContactsForm(cloneTemplate(contactsTemplate),evt)
const Success = new success(cloneTemplate(successTemplate),'order-success')
//карточки
api
	.getCards()
	.then(statusData.setCatalog.bind(statusData))
	.catch((err) => {
		``;
		console.error(err);
	});
evt.on('items:changed', () => {
	page.Catalog = statusData.catalog.map((item) => {
		const card = new ViewCard(cloneTemplate(cardCatalogTemplate), {
			onClick: () => evt.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});
evt.on('card:select',(item:Product)=>{
  page.LockScroll = true;
  const product = new ViewCard(cloneTemplate(cardPreviewTemplate),  {
    onClick: () =>{
      evt.emit('cards:toBasket',item)
    },
  });
  modal.render({
    content:product.render({
      id:item.id,
      title:item.title,
      image:item.image,
      description:item.description,
      selected:item.selected,
      category:item.category,
      price:item.price
    })
  })
})
//корзина
evt.on('card:toBasket', (item: Product) => {
	item.selected = true;
	statusData.addToBasket(item);
	page.Counter = statusData.getCountProductInBasket();
	modal.remove();
});
evt.on('basket:remove', (item: Product) => {
item.selected = false;
statusData.removeFromBasket(item);
basket.total = statusData.getTotalBasketPrice();
page.Counter = statusData.getCountProductInBasket();
if (!statusData.basket.length) {
  basket.disableBTN();
}
});
evt.on('basket:open',()=>{
  page.LockScroll = true
  const itemBasket = statusData.basket.map((item,index)=>{
    const ProductBasket = new ProductInBasket('card',cloneTemplate(cardBasketTemplate),{
      onClick:()=> evt.emit('basket:remove',item)
    })
    return ProductBasket.render({
      title:item.title,
      price:item.price,
      index:index + 1,
    })
  })
  modal.render({
    content:basket.render({
      list:itemBasket,
      total:statusData.getTotalBasketPrice()
    })
  })
})
//закза
evt.on('basket:order',()=>{
  modal.render({
    content: order.render({
      address:'',
      payment:'',
      valid:false,
      errors:[]
    })
  })
})
evt.on('order:submit',()=>{
  statusData.order.total =statusData.getTotalBasketPrice()
  modal.render({
    content:contacts.render({
      email:"",
      phone:"",
      valid:false,
      errors:[],
    })
  })
})
evt.on('contacts:submit',()=>{
  api
  .getOrder(statusData.order)
  .then((res)=>{
    evt.emit('order:success',res);
    statusData.clearOrder();
    statusData.clearBasket();
    page.Counter = 0;
    statusData.resetSelected()
    order.clear()
  })
  .catch((err) => {
    console.log(err);
  });
})
//изменение
evt.on('orderErrors:change',(errors:Partial<IValid>)=>{
  const {payment,address} = errors
  order.valid = !payment && !address
  order.errors = Object.values({payment,address}).filter(i => !!i).join(";")
}
)
evt.on('contactsErrors:change',(errors:Partial<IValid>)=>{
  const {email,phone} = errors
  order.valid = !email && !phone
  order.errors = Object.values({email,phone}).filter(i => !!i).join(";")
})
evt.on('orderInput:change',(data:{fied:keyof IDeliveryForm; value:string})=>{
  statusData.setOrderFields(data.fied,data.value)
}
)
//успешная покупка
evt.on('order:success',(res:ApiListResponse<string>)=>{
  modal.render({
    content:Success.render({
      description:res.total
    })
  })
})
//закрытие
evt.on('modal:close', () => {
	page.LockScroll = false;
})
