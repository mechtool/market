import { CartModel } from './cart.model';

export class CartUpdateItemQuantityRequestModel implements CartModel {
  quantity: number;
}
