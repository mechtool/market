import { Injectable } from '@angular/core';
import { BNetService } from './bnet.service';
import { TradeOfferResponseModel } from '#shared/modules';
import { Observable } from 'rxjs';

@Injectable()
export class TradeOffersService {

  constructor(private _bnetService: BNetService) {
  }

  getTradeOffer(id: string): Observable<TradeOfferResponseModel> {
    return this._bnetService.getTradeOffer(id);
  }
}
