import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  CategoryModel,
  CategoryResponseModel,
  DocumentResponseModel,
  ParticipationRequestResponseModel,
  UserOrganizationModel,
} from './models';
import { convertListToTree, innKppToLegalId } from '#shared/utils';
import { BNetService } from './bnet.service';
import { CookieService } from './cookie.service';
import { LocalStorageService } from './local-storage.service';
import { OrganizationsService } from './organizations.service';
import { UserStateService } from './user-state.service';
import { ExternalProvidersService } from './external-providers.service';

@Injectable()
export class UserService {
  organizations$: BehaviorSubject<UserOrganizationModel[]> = new BehaviorSubject(null);
  ownParticipationRequests$: BehaviorSubject<any[]> = new BehaviorSubject(null);
  categories$: BehaviorSubject<CategoryModel[]> = new BehaviorSubject(null);
  participationRequests$: BehaviorSubject<ParticipationRequestResponseModel[]> = new BehaviorSubject(null);
  newAccountDocumentsCounter$: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    private _bnetService: BNetService,
    private _cookieService: CookieService,
    private _userStateService: UserStateService,
    private _localStorageService: LocalStorageService,
    private _organizationsService: OrganizationsService,
    private _externalProvidersService: ExternalProvidersService,
  ) {
  }

  setUserData(data: any): void {
    this._userStateService.currentUser$.next(data);
    if (data) {
      this._externalProvidersService.fireGTMEvent({ userId: data.userInfo?.userId });
    }
  }

  setUserOrganizations(data: any): Observable<any> {
    this.organizations$.next(data);
    return of(data);
  }

  getUserLastLoginTimestamp(uin: string): number {
    return this._cookieService.getUserLastLoginTimestamp(uin);
  }

  setUserLastLoginTimestamp(uin: string, timestamp: number) {
    this._cookieService.setUserLastLoginTimestamp(uin, timestamp);
  }

  updateUserCategories(): Observable<any> {
    return this._bnetService.getCategories().pipe(
      catchError((err) => {
        this.categories$.next(null);
        return throwError(null);
      }),
      tap((res: CategoryResponseModel) => {
        const tree = convertListToTree(res.categories);
        this.categories$.next(tree);
      }),
    );
  }

  updateParticipationRequests(): Observable<any> {
    return this._organizationsService.getParticipationRequests().pipe(
      catchError((err) => {
        this.participationRequests$.next(null);
        return of(null);
      }),
      tap((res: ParticipationRequestResponseModel[]) => {
        this.participationRequests$.next(res);
      }),
    );
  }

  updateNewAccountDocumentsCounter(): Observable<any> {
    const legalIds = this._legalIds();
    if (legalIds?.length) {
      return this._bnetService
        .getAccounts({
          legalIds: this._legalIds(),
          page: 1,
          size: 100,
        })
        .pipe(
          catchError((err) => {
            this.newAccountDocumentsCounter$.next(0);
            return of(null);
          }),
          tap((docs: DocumentResponseModel[]) => {
            const uin = this._userStateService.currentUser$.getValue()?.userInfo.userId;
            const lastLoginTimestamp = this.getUserLastLoginTimestamp(uin);
            if (lastLoginTimestamp) {
              const counter = docs.filter((doc) => doc.sentDate > lastLoginTimestamp).length;
              this.newAccountDocumentsCounter$.next(counter);
            }
            if (!lastLoginTimestamp) {
              this.newAccountDocumentsCounter$.next(docs?.length);
            }
          }),
        );
    }
    return of(null);
  }

  watchUserDataChangesForUserStatusCookie() {
    this._userStateService.currentUser$.subscribe((res) => {
      if (res) {
        this._localStorageService.putUserData(res);
      }
      if (!res) {
        this._localStorageService.removeUserData();
      }
    });
  }

  // TODO: отрефакторить чтобы не было повторений _legalIds и в EdiService
  private _legalIds() {
    const limit = 100;
    const userOrganizations = this.organizations$.getValue()?.slice(0, limit);
    if (userOrganizations) {
      return userOrganizations.map((org) => {
        return innKppToLegalId(org.legalRequisites.inn, org.legalRequisites.kpp);
      });
    }
    return null;
  }
}
