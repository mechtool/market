import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ParticipationRequestResponseModel, UserOrganizationModel, } from './models';
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
  participationRequests$: BehaviorSubject<ParticipationRequestResponseModel[]> = new BehaviorSubject(null);

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

  setUserInformationSetted(): void {
    this._userStateService.isUserInformationSetted$.next(true);
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
}
