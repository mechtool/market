import { RelationModel } from './relation.model'
import { CartDataOrderExtendedModel } from './cart-data-order-extended.model';

export class CartDataExtendedModel {
  content: CartDataOrderExtendedModel[];
  _links?: RelationModel;
}

