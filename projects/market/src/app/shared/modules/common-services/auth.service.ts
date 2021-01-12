import { DOCUMENT, Location } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Observable, of, Subscription, throwError } from 'rxjs';
import { catchError, delay, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '#environments/environment';
import { redirectTo, unsubscribeList } from '#shared/utils';
import { ApiService } from './api.service';
import { AuthRefreshRequestModel, AuthRequestModel, AuthResponseModel } from './models';
import { UserService } from './user.service';
import { OrganizationsService } from './organizations.service';

const API_URL = environment.apiUrl;
const ITS_URL = environment.itsUrl;
/**
 * URL пути находящиеся под аутентификацией
 */
const pathsWithAuth = [/^\/supplier$/i, /^\/my\/organizations$/i, /^\/my\/organizations\/(?:([^\/]+?))\/?$/i, /^\/my\/orders$/i];

@Injectable()
export class AuthService implements OnDestroy{
  loginMessageSubscription: Subscription;
  registerMessageSubscription: Subscription;

  get origin(): string {
    return this._document.location.origin;
  }

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _location: Location,
    private _apiService: ApiService,
    private _userService: UserService,
    private _organizationsService: OrganizationsService,
    private _router: Router,
  ) {
  }

  ngOnDestroy() {
    unsubscribeList([this.loginMessageSubscription, this.registerMessageSubscription])
  }

  logout(path: string = '/'): Observable<any> {
    return of(null).pipe(
      tap(() => {
        const routePath = path === '' || this.isPathWithAuth(path) ? '/' : path;
        this._userService.setUserData(null);
        redirectTo(`${ITS_URL}/logout?service=${this.origin}&relativeBackUrl=${routePath}`);
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

  login(): Observable<any> {
    this.createPopup('loginPopup', `${ITS_URL}/login?service=${this.origin}`);

    if (!this.loginMessageSubscription) {
      this.loginMessageSubscription = fromEvent(window, 'message')
        .pipe(
          filter((event: MessageEvent) => event.source['name'] === 'loginPopup'),
          take(1),
          switchMap((event) => {
            return this.auth({ serviceName: this.origin, ticket: event.data })
          }),
          switchMap((authResponse: AuthResponseModel) => this.setUserDependableData$(authResponse)),
        )
        .subscribe();
    }

    return of(null);
  }

  setUserDependableData$(userData): Observable<any> {
    return of(null).pipe(
      tap(() => this._userService.setUserData(userData)),
      switchMap((_) => this._organizationsService.getUserOrganizations()),
      switchMap((res) => this._userService.setUserOrganizations(res)),
      switchMap((res) => this._userService.updateParticipationRequests()),
      switchMap((res) => this._userService.updateNewAccountDocumentsCounter()),
      catchError((_) => throwError(null)),
    )
  }

  register() {
    this.createPopup('registerPopup', `${ITS_URL}/registration?redirect=${this.origin}`);

    if (!this.registerMessageSubscription) {
      this.registerMessageSubscription = fromEvent(window, 'message')
        .pipe(
          filter((event: MessageEvent) => event.source['name'] === 'registerPopup'),
          take(1),
          switchMap((event) => {
            return this.auth({ serviceName: this.origin, ticket: event.data })
          }),
          switchMap((authResponse: AuthResponseModel) => this.setUserDependableData$(authResponse)),
        )
        .subscribe();
    }

    return of(null);
  }

  createPopup(name, url) {
    const width = 500;
    const height = 500;
    const pos = {
      x: (screen.width / 2) - (width / 2),
      y: (screen.height/2) - (height / 2)
    };
    const params = `width=${width}, height=${height}, left=${pos.x}, top=${pos.y}, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no`;

    window.open(url, name, params);
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
