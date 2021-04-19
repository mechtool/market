import { Injectable } from '@angular/core';
import { BannersListResponseModel } from '#shared/modules/common-services/models';
import { Observable } from 'rxjs';
import { BNetService } from './bnet.service';
import { removeLastSlash } from '#shared/utils';

@Injectable()
export class BannerService {

  constructor(
    private _bnetService: BNetService,
  ) {
  }

  getBanners(): Observable<BannersListResponseModel> {
    const pageId = removeLastSlash(location.pathname);
    return this._bnetService.getBanners(pageId);
  }
}
