import { Injectable } from '@angular/core';
import { PagesStaticListResponseModel } from '#shared/modules/common-services/models';
import { Observable } from 'rxjs';
import { BNetService } from './bnet.service';

@Injectable()
  export class PagesStaticService {

  constructor(
    private _bnetService: BNetService,
  ) {
  }

  getPageStatic(): Observable<PagesStaticListResponseModel> {
    const pageId = this.removeLastSlash(location.pathname);
    return this._bnetService.getPageStatic(pageId);
  }


  private removeLastSlash(url: string) {
    if (url.lastIndexOf('/') === (url.length - 1)) {
      return url.slice(0, -1);
    }
    return url;
  }
}
