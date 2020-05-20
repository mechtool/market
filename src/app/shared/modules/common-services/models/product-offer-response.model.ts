import { TradeOffersModel } from './trade-offers.model';
import { ProductModel } from './product.model';

export class ProductOfferResponseModel {
  product: ProductModel;
  offers: TradeOffersModel[];
}
