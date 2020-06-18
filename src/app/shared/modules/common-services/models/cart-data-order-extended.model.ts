import { CartDataOrderModel } from './cart-data-order.model';
import { RelationModel } from './relation.model'

export class CartDataOrderExtendedModel extends CartDataOrderModel {
  consumer: {
    name: string;
    inn: string;
    kpp: string;
    id: string;
  };
}

