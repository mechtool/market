import { ProductOffersModel } from './product-offers.model';
import { ProductOffersListSummaryModel } from './product-offers-list-summary.model';
import { PageModel } from './page.model';

export class ProductOffersListResponseModel {
  page: PageModel;
  _embedded: {
    productOffers: ProductOffersModel[];
    summary: ProductOffersListSummaryModel;
  };
}

