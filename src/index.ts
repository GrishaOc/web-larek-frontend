import './scss/styles.scss';
import { ApiListResponse } from './components/base/api';
import { API_URL, CDN_URL} from './utils/constants';
import { StatusApp } from './components/StatusApp';
import { EventEmitter } from './components/base/events';
import { ICards, IContacntForm, IDeliveryForm, IValidContact,IValidDelivery } from './types/index';
import { Page } from './components/Page';
import { Card, ViewCard } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { basketTemplate, cardBasketTemplate, cardCatalogTemplate, cardPreviewTemplate, contactsTemplate, orderTemplate, successTemplate } from './components/templates';
import { Modal } from './components/common/Modal';
import { Basket, ProductInBasket } from './components/Basket';
import { DeliveryForm } from './components/DeliveryForm';
import { ContactsForm } from './components/ContactsForm';
import { Success } from './components/success';
import {WebLarekApi} from './components/LarekApi'

const evt = new EventEmitter();
const api = new WebLarekApi(CDN_URL,API_URL);
const statusData = new StatusApp({}, evt);
const page = new Page(document.body, evt);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), evt);
const basket = new Basket('basket',cloneTemplate(basketTemplate),evt);
const deliveryForm = new DeliveryForm('order',cloneTemplate(orderTemplate),evt)
const contacts = new ContactsForm(cloneTemplate(contactsTemplate),evt)
const success = new Success('order-success',cloneTemplate(successTemplate),{onClick:()=> modal.remove()})
//карточки
api
  .getCards()
	.then(statusData.setCatalog.bind(statusData))
	.catch((error) => {
		console.log(error);
	});
evt.on('items:changed', () => {
	page.Catalog = statusData.catalog.map((item) => {
		const card = new Card('card',cloneTemplate(cardCatalogTemplate), {
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
evt.on('card:select',(item:ICards)=>{
  page.LockScroll = true;
  const product = new ViewCard(cloneTemplate(cardPreviewTemplate),  {
    onClick: () => {
      if (item.selected) {
        evt.emit('basket:remove',item);
      } else {
        evt.emit('card:toBasket', item);
      }
      product.updateButton(item.selected)
    }
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
evt.on('modal:remove', () => {
	page.LockScroll = false;
  contacts.clear()
  deliveryForm.clear();
})
//корзина
evt.on('card:toBasket', (item: ICards) => {
	item.selected = true;
	statusData.toBasket(item);
	page.Counter = statusData.getCountProductInBasket();
	modal.remove();
});
evt.on('basket:remove', (item: ICards) => {
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
    const card = new ProductInBasket('card',cloneTemplate(cardBasketTemplate),{
      onClick:()=> evt.emit('basket:remove',item)
    })
    return card.render({
      price:item.price,
      title:item.title,
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
    content: deliveryForm.render({
      address:'',
      payment:'',
      valid:false,
      errors:[]
    })
  })
})
evt.on('order:submit',()=>{
  statusData.order.total =statusData.getTotalBasketPrice()
  statusData.Selected();
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
    deliveryForm.clear();
    contacts.clear();
  })
  .catch((err) => {
    console.log(err);
  });
})
//изменение
evt.on('orderErrors:change',(errors:Partial<IValidDelivery>)=>{
  const {payment,address} = errors
  deliveryForm.valid = !payment && !address
  deliveryForm.errors = Object.values({payment,address}).filter((i) => !!i).join(";")
}
)
evt.on('contactsErrors:change',(errors:Partial<IValidContact>)=>{
  const {email,phone} = errors
  contacts.valid = !email && !phone
  contacts.errors = Object.values({email,phone}).filter((i) => !!i).join(";")
})
evt.on('orderInput:change',(data:{cell:keyof IDeliveryForm; value:string})=>{
  statusData.setOrderFields(data.cell,data.value)
}
)
//успешная покупка
evt.on('order:success',(res:ApiListResponse<string>)=>{
  modal.render({
    content:success.render({
      description:res.total
    })
  })
})

