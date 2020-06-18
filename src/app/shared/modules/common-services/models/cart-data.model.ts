import { RelationModel } from './relation.model'
import { CartDataOrderModel } from './cart-data-order.model';

export class CartDataModel {
  content: CartDataOrderModel[];
  _links?: RelationModel;
}

