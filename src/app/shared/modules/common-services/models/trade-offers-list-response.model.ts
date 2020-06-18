import { PageModel } from './page.model';
import { TradeOfferSummaryModel } from './trade-offer-summary.model';

export class TradeOffersListResponseModel {
  page: PageModel;
  _embedded: {
    items: TradeOfferSummaryModel[]
  };
}
