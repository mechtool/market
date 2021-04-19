import { Injectable } from '@angular/core';
import { PriceListFeedResponseModel, PriceListResponseModel } from '#shared/modules/common-services/models';
import { Observable } from 'rxjs';
import { BNetService } from './bnet.service';

@Injectable()
export class PriceListsService {

  constructor(private _bnetService: BNetService) {
  }

  placePriceList(priceList: any): Observable<any> {
    return this._bnetService.placePriceList(priceList);
  }

  updatePriceList(priceListId: string, priceList: any): Observable<any> {
    return this._bnetService.updatePriceList(priceListId, priceList);
  }

  getPriceLists(): Observable<PriceListResponseModel[]> {
    return this._bnetService.getPriceLists();
  }

  getPriceList(priceListExternalId: string): Observable<PriceListResponseModel> {
    return this._bnetService.getPriceList(priceListExternalId);
  }

  deletePriceList(priceListId: string): Observable<any> {
    return this._bnetService.deletePriceList(priceListId);
  }

  getPriceListTemplateFile(): Observable<any> {
    return this._bnetService.getPriceListTemplateFile();
  }

  placePriceListFeed(priceListExternalId: string, feed: any): Observable<any> {
    return this._bnetService.placePriceListFeed(priceListExternalId, feed);
  }

  getPriceListFeed(priceListExternalId: string): Observable<PriceListFeedResponseModel> {
    return this._bnetService.getPriceListFeed(priceListExternalId);
  }

  deletePriceListFeed(priceListExternalId: string): Observable<any> {
    return this._bnetService.deletePriceListFeed(priceListExternalId);
  }

  startFeed(priceListExternalId: string): Observable<any> {
    return this._bnetService.startFeed(priceListExternalId);
  }
}
