import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap, pairwise } from 'rxjs/operators';
import { AuthResponseModel, CategoryModel, CategoryResponseModel, UserOrganizationModel } from './models';
import { convertListToTree } from '#shared/utils';
import { BNetService } from './bnet.service';
import { CookieService } from './cookie.service';
import { UserStatusEnumModel } from './models/user-status-enum.model';


@Injectable()
export class UserService {
  userOrganizations$: BehaviorSubject<UserOrganizationModel[]> = new BehaviorSubject(null);
  userParticipationRequests$: BehaviorSubject<any[]> = new BehaviorSubject(null);
  userCategories$: BehaviorSubject<CategoryModel[]> = new BehaviorSubject(null);
  userData$: BehaviorSubject<AuthResponseModel> = new BehaviorSubject(null);

  constructor(
    private _bnetService: BNetService,
    private _cookieService: CookieService,
  ) {}

  setUserParticipationRequests(data: any): void {
    this.userParticipationRequests$.next(data);
  }

  setUserData(data: any): void {
    this.userData$.next(data);
  }

  setUserOrganizations(data: any): void {
    this.userOrganizations$.next(data);
  }

  updateUserCategories(): Observable<boolean> {
    return this._bnetService.getCategories().pipe(
      catchError((err) => {
        return throwError(false);
      }),
      map((res: CategoryResponseModel) => {
        const tree = convertListToTree(res.categories);
        this.userCategories$.next(tree);
        return true;
      })
    );
  }

  watchUserDataChangesForUserStatusCookie() {
    this.userData$
    .subscribe((res) => {
      this._cookieService.setUserStatusCookie((res) ? UserStatusEnumModel.AUTHED : UserStatusEnumModel.NOT_AUTHED);
    })
  }
}
