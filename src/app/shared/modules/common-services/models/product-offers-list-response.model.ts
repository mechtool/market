import { ProductOffersModel } from './product-offers.model';
import { ProductOffersSummaryModel } from './product-offers-summary.model';
import { PageModel } from './page.model';

export class ProductOffersListResponseModel {
  page: PageModel;
  _embedded: {
    productOffers: ProductOffersModel[];
    summary: ProductOffersSummaryModel;
  };
}

