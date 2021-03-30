import { Injectable } from '@angular/core';
import { BannersListResponseModel } from '#shared/modules/common-services/models';
import { Observable, of } from 'rxjs';
import { BNetService } from './bnet.service';

@Injectable()
export class BannerService {

  constructor(
    private _bnetService: BNetService,
  ) {
  }

  getBanners(): Observable<BannersListResponseModel> {
    const pageId = this.removeLastSlash(location.pathname);
    return this._bnetService.getBanners(pageId);
  }


  private removeLastSlash(url: string) {
    if (url.lastIndexOf('/') === (url.length - 1)) {
      return url.slice(0, -1);
    }
    return url;
  }

}
