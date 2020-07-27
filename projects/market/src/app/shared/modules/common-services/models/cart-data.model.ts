import { CartDataOrderRelationResponseModel } from './cart-data-order-relation-response.model'
import { CartDataOrderModel } from './cart-data-order.model';

export class CartDataModel {
  content: CartDataOrderModel[];
  _links?: CartDataOrderRelationResponseModel;
}

