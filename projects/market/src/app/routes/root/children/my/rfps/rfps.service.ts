import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, pluck } from 'rxjs/operators';
import format from 'date-fns/format';
import {
  BNetService,
  CommerceOfferMlModel,
  EdiRequestModel,
  RfpItemResponseModel,
  RfpListResponseItemModel
} from '#shared/modules';
import { OfferListItemModel } from './models';
import { getBase64MimeType } from "#shared/utils";


@Injectable()
export class RfpsService {

  constructor(private _bnetService: BNetService) {
  }

  getUserRfps(): Observable<RfpListResponseItemModel[]> {
    return this._bnetService.getUserRfps().pipe(
      pluck('_embedded', 'items'),
    );
  }

  getUserRfpById(rfpId: string): Observable<RfpItemResponseModel> {
    return this._bnetService.getUserRfpById(rfpId)
  }

  cancelUserRfpById(id: string): Observable<any> {
    return this.modifyUserRfpById(id, {
      dateCancelled: format(new Date(), 'yyyy-MM-dd'),
    });
  }

  createUserRfp(data: any, idempotencyKey: string): Observable<any> {
    return this._bnetService.createUserRfp(data, idempotencyKey);
  }

  updateUserRfpById(id: string, data: any, idempotencyKey: string): Observable<any> {
    return this._bnetService.updateUserRfpById(id, data, idempotencyKey);
  }

  modifyUserRfpById(id: string, data: any): Observable<any> {
    return this._bnetService.modifyUserRfpById(id, data);
  }

  getUserOffers(query: EdiRequestModel): Observable<OfferListItemModel[]> {
    return this._bnetService.getUserOffers(query)
      .pipe(
        map((userOffers) => {
          return userOffers.map((userOffer) => {
            return new OfferListItemModel(userOffer);
          });
        })
      )
  }

  getUserOfferById(offerId: number): Observable<CommerceOfferMlModel> {
    return this._bnetService.getUserOfferById(offerId);
  }

}

