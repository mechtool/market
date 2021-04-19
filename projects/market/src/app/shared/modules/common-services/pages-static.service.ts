import { Injectable } from '@angular/core';
import { PagesStaticListResponseModel } from '#shared/modules/common-services/models';
import { Observable } from 'rxjs';
import { BNetService } from './bnet.service';
import { removeLastSlash } from '#shared/utils';

@Injectable()
export class PagesStaticService {

  constructor(
    private _bnetService: BNetService,
  ) {
  }

  getPageStatic(): Observable<PagesStaticListResponseModel> {
    const pageId = removeLastSlash(location.pathname);
    return this._bnetService.getPageStatic(pageId);
  }
}
