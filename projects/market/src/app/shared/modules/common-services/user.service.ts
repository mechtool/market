import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  AuthResponseModel,
  CategoryModel,
  CategoryResponseModel,
  DocumentResponseModel,
  ParticipationRequestResponseModel,
  UserOrganizationModel,
} from './models';
import { convertListToTree, innKppToLegalId } from '#shared/utils';
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
  newAccountDocumentsCounter$: BehaviorSubject<number> = new BehaviorSubject(0);

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
        return null;
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
          const uin = this.userData$.value?.userInfo.userId;
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

  watchUserDataChangesForUserStatusCookie() {
    this.userData$.subscribe((res) => {
      this._cookieService.setUserStatusCookie(res ? UserStatusEnumModel.AUTHED : UserStatusEnumModel.NOT_AUTHED);
    });
  }

  // TODO: отрефакторить чтобы не было повторений _legalIds и в EdiService
  private _legalIds() {
    const userOrganizations = this.organizations$.getValue();
    if (userOrganizations) {
      return userOrganizations.map((org) => {
        return innKppToLegalId(org.legalRequisites.inn, org.legalRequisites.kpp);
      });
    }
    return null;
  }
}
