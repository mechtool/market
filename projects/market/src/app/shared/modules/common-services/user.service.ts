import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap, pairwise } from 'rxjs/operators';
import {
  AuthResponseModel,
  CategoryModel,
  CategoryResponseModel,
  ParticipationRequestResponseModel,
  UserOrganizationModel
} from './models';
import { convertListToTree } from '#shared/utils';
import { BNetService } from './bnet.service';
import { CookieService } from './cookie.service';
import { UserStatusEnumModel } from './models/user-status-enum.model';
import { OrganizationsService } from './organizations.service';

@Injectable()
export class UserService {
  organizations$: BehaviorSubject<UserOrganizationModel[]> = new BehaviorSubject(null);
  ownParticipationRequests$: BehaviorSubject<any[]> = new BehaviorSubject(null);
  categories$: BehaviorSubject<CategoryModel[]> = new BehaviorSubject(null);
  userData$: BehaviorSubject<AuthResponseModel> = new BehaviorSubject(null);
  participationRequests$: BehaviorSubject<ParticipationRequestResponseModel[]> = new BehaviorSubject(null);

  constructor(
    private _bnetService: BNetService,
    private _organizationsService: OrganizationsService,
    private _cookieService: CookieService,
  ) {}

  setUserData(data: any): void {
    this.userData$.next(data);
  }

  setUserOrganizations(data: any): void {
    this.organizations$.next(data);
  }

  updateUserCategories(): Observable<any> {
    return this._bnetService.getCategories().pipe(
      catchError((err) => {
        this.categories$.next(null);
        return null;
      }),
      tap((res: CategoryResponseModel) => {
        const tree = convertListToTree(res.categories);
        this.categories$.next(tree);
      })
    );
  }

  updateParticipationRequests(): Observable<any> {
    return this._organizationsService.getParticipationRequests()
      .pipe(
        catchError((err) => {
          this.participationRequests$.next(null);
          return of(null);
        }),
        tap((res: ParticipationRequestResponseModel[]) => {
          this.participationRequests$.next(res);
        })
      );
  }

  watchUserDataChangesForUserStatusCookie() {
    this.userData$
      .subscribe((res) => {
        this._cookieService.setUserStatusCookie((res) ? UserStatusEnumModel.AUTHED : UserStatusEnumModel.NOT_AUTHED);
      });
  }
}
