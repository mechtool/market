import { DOCUMENT, Location } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Observable, of, Subscription, throwError } from 'rxjs';
import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '#environments/environment';
import { redirectTo, unsubscribeList } from '#shared/utils';
import { ApiService } from './api.service';
import { AuthRefreshRequestModel, AuthRequestModel, AuthResponseModel } from './models';
import { UserService } from './user.service';
import { OrganizationsService } from './organizations.service';
import { CategoryService } from './category.service';
import { EdiService } from './edi.service';

const API_URL = environment.apiUrl;
const ITS_URL = environment.itsUrl;
/**
 * URL пути находящиеся под аутентификацией
 */
const pathsWithAuth = [/^\/supplier$/i, /^\/my\/organizations$/i, /^\/my\/organizations\/(?:([^\/]+?))\/?$/i, /^\/my\/orders$/i];

@Injectable()
export class AuthService implements OnDestroy {
  messageSubscription: Subscription;
  popupRef: WindowProxy = null;
  popupRefName: string = null;

  get origin(): string {
    return this._document.location.origin;
  }

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _router: Router,
    private _location: Location,
    private _apiService: ApiService,
    private _ediService: EdiService,
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _organizationsService: OrganizationsService,
  ) {
  }

  ngOnDestroy() {
    unsubscribeList([this.messageSubscription])
  }

  logout(path: string = '/'): Observable<any> {
    return of(null).pipe(
      tap(() => {
        this._userService.setUserData(null);
        const backUrl = encodeURIComponent(path === '' || this.isPathWithAuth(path) ? '/' : path);
        const service = encodeURIComponent(this.origin);
        const url = `${ITS_URL}/logout?service=${service}&relativeBackUrl=${backUrl}`;
        redirectTo(url);

      }),
      switchMap(() =>
        this.revoke().pipe(
          catchError(() => {
            return of(null);
          }),
        ),
      ),
      delay(3e2),
    );
  }

  setUserDependableData$(userData, isInternalCall = false): Observable<any> {
    return of(null).pipe(
      tap(() => this._userService.setUserData(userData)),
      switchMap((_) => this._organizationsService.getUserOrganizations()),
      switchMap((res) => this._userService.setUserOrganizations(res)),
      switchMap((res) => this._userService.updateParticipationRequests()),
      switchMap((res) => this._ediService.updateNewAccountDocumentsCounter()),
      switchMap((res) => this._ediService.updateNewInboundOrdersDocumentsCounter()),
      switchMap((res) => isInternalCall ? this._categoryService.updateCategories() : of(null)),
      tap(() => {
        this._userService.setUserInformationSetted();
      }),
      catchError((_) => throwError(null)),
    )
  }

  login(): Observable<any> {
    const popupName = 'loginPopup';
    return this._createPopupAndSubscribe(popupName, `${ITS_URL}/login?service=${this.origin}`);
  }

  register(): Observable<any> {
    const popupName = 'registerPopup';
    return this._createPopupAndSubscribe(popupName, `${ITS_URL}/registration?redirect=${this.origin}`);
  }

  private _createPopupAndSubscribe(popupName, url) {
    if (!this.popupRef) {
      this._createPopup(popupName, url);
      this.popupRefName = popupName;
      this._subscribeToMessageEvent();
      return of(null);
    }
    try {
      if (!this.popupRef.window) {
        this.popupRef = null;
        this.messageSubscription.unsubscribe();
        this.messageSubscription = null;
        this._createPopup(popupName, url);
        this.popupRefName = popupName;
        this._subscribeToMessageEvent();
        return of(null);
      }
    } catch (e) {
      this.popupRef = null;
      this.messageSubscription.unsubscribe();
      this.messageSubscription = null;
      this._createPopup(popupName, url);
      this.popupRefName = popupName;
      this._subscribeToMessageEvent();
      return of(null);
    }

    if (this.popupRefName === popupName) {
      this.popupRef.focus();
    }
    if (this.popupRefName !== popupName) {
      this.popupRef.close();
      this.popupRef = null;
      this.messageSubscription.unsubscribe();
      this.messageSubscription = null;
      this._createPopup(popupName, url);
      this.popupRefName = popupName;
      this._subscribeToMessageEvent();
      return of(null);
    }
  }

  private _createPopup(name, url) {
    const width = 500;
    const height = 500;
    const pos = {
      x: (screen.width / 2) - (width / 2),
      y: (screen.height / 2) - (height / 2)
    };
    const params = `width=${width}, height=${height}, left=${pos.x}, top=${pos.y}, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no`;
    this.popupRef = window.open(url, name, params);
    this.popupRef.focus();
  }

  private _subscribeToMessageEvent() {
    if (!this.messageSubscription) {
      this.messageSubscription = fromEvent(window, 'message')
        .pipe(
          take(1),
          switchMap((event: MessageEvent) => {
            return this.auth({ serviceName: this.origin, ticket: event.data })
          }),
          switchMap((authResponse: AuthResponseModel) => this.setUserDependableData$(authResponse, true)),
        )
        .subscribe(() => {
          if (!this._userService.organizations$?.value.length) {
            this._router.navigateByUrl('/blank', { skipLocationChange: true }).then(() => this._router.navigate(['./my', 'organizations'], {
              queryParams: { tab: `c;${this._location.path()}` },
            }));
          }
        });
    }
  }

  auth(authRequest: AuthRequestModel): Observable<AuthResponseModel> {
    return this._apiService.post(`${API_URL}/auth`, {
      ticket: authRequest.ticket,
      serviceName: authRequest.serviceName,
    });
  }

  refresh(authRefreshRequest: AuthRefreshRequestModel): Observable<AuthResponseModel> {
    return this._apiService.post(`${API_URL}/auth/refresh`, authRefreshRequest);
  }

  revoke() {
    return this._apiService.post(`${API_URL}/auth/revoke`);
  }

  goTo(url: string): void {
    this._router.navigateByUrl('/blank', { skipLocationChange: true }).then((x) => {
      this._router.navigateByUrl(url);
      this._location.replaceState(this._location.path().split('?')[0], '');
    });
  }

  private isPathWithAuth(currentUrl: string): boolean {
    const urlWithoutQueryParams = currentUrl.split('?')[0];
    return pathsWithAuth.some((regEx) => regEx.test(urlWithoutQueryParams));
  }
}
