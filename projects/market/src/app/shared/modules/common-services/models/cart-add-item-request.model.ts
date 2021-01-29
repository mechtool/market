import { CartModel } from './cart.model';

export class CartAddItemRequestModel implements CartModel {
  tradeOfferId: string;
  quantity: number;
}
