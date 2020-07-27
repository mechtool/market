import { CartDataOrderResponseModel } from './cart-data-order-response.model';
import { CartDataOrderRelationResponseModel } from './cart-data-order-relation-response.model'

export class CartDataOrderModel extends CartDataOrderResponseModel {
  consumer: {
    name: string;
    inn: string;
    kpp: string;
    id: string;
  };
}

