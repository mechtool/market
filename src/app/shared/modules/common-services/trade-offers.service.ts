import { Injectable } from '@angular/core';
import { BNetService } from './bnet.service';
import { TradeOfferResponseModel, TradeOffersListResponseModel, TradeOffersRequestModel } from '#shared/modules';
import { Observable } from 'rxjs';

@Injectable()
export class TradeOffersService {

  constructor(private _bnetService: BNetService) {
  }

  get(id: string): Observable<TradeOfferResponseModel> {
    return this._bnetService.getTradeOffer(id);
  }

  search(query: TradeOffersRequestModel): Observable<TradeOffersListResponseModel> {
    return this._bnetService.searchTradeOffers(query);
  }
}
