import { DOCUMENT, Location } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '#environments/environment';
import { getParamFromQueryString, getQueryStringWithoutParam, redirectTo } from '#shared/utils';
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
export class AuthService {
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
  ) {}

  logout(path: string = '/') {
    const revokeToken = this.revoke().subscribe(() => {
      const routePath = this.isPathWithAuth(path) ? '/' : path;
      this._userService.setUserData(null);
      revokeToken.unsubscribe();
      redirectTo(`${ITS_URL}/logout?service=${this.origin}&relativeBackUrl=${routePath}`);
    });
  }

  login(path: string = '/', redirectable = true): Observable<any> {
    const pathName = path.split('?')[0];
    const ticket = getParamFromQueryString('ticket');
    const queryStringWithoutTicket = getQueryStringWithoutParam(this._document.location.search, 'ticket');
    const currentPathname = this._document.location.pathname;
    const url =
      pathName === currentPathname
        ? `${this.origin}${pathName}${encodeURIComponent(queryStringWithoutTicket)}`
        : `${this.origin}${pathName}`;
    if (ticket) {
      const serviceName = `${this.origin}${pathName}${encodeURIComponent(queryStringWithoutTicket)}`;
      return this.auth({ ticket, serviceName }).pipe(
        tap((authResponse: AuthResponseModel) => this._userService.setUserData(authResponse)),
        switchMap((_) => this._organizationsService.getUserOrganizations()),
        switchMap((res) => this._userService.setUserOrganizations(res)),
        switchMap((res) => this._userService.updateParticipationRequests()),
        switchMap((res) => this._userService.updateNewAccountDocumentsCounter()),
        map(() => {
          this.goTo(`${currentPathname}${queryStringWithoutTicket}`);
          return null;
        }),
        catchError((_) => {
          return throwError(null);
        }),
      );
    }
    if (!ticket && redirectable) {
      this.redirectExternalSsoAuth(url);
    }
    if (!ticket && !redirectable) {
      return of(url);
    }
  }

  register(path: string = '/') {
    redirectTo(`${ITS_URL}/registration?redirect=${this.origin}${path}`);
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
    this._router.navigateByUrl(this._router.url.split('?')[0], { skipLocationChange: true }).then((x) => {
      this._router.navigateByUrl(url);
      this._location.replaceState(this._location.path().split('?')[0], '');
    });
  }

  redirectExternalSsoAuth(url: string): void {
    this._document.location.assign(`${ITS_URL}/login?service=${url}`);
  }

  private isPathWithAuth(currentUrl: string): boolean {
    const urlWithoutQueryParams = currentUrl.split('?')[0];
    return pathsWithAuth.some((regEx) => regEx.test(urlWithoutQueryParams));
  }
}
