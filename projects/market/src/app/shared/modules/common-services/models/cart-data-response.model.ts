import { CartDataOrderRelationResponseModel } from './cart-data-order-relation-response.model'
import { CartDataOrderResponseModel } from './cart-data-order-response.model';

export class CartDataResponseModel {
  content: CartDataOrderResponseModel[];
  _links?: CartDataOrderRelationResponseModel;
}

