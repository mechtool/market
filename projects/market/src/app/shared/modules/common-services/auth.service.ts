import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap, switchMap } from 'rxjs/operators';
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
  constructor(
    private _apiService: ApiService,
    private _userService: UserService,
    private _organizationsService: OrganizationsService,
    private _router: Router,
  ) {}

  logout(path: string = '/') {
    const routePath = this.isPathWithAuth(path) ? '/' : path;
    this._userService.setUserData(null);
    redirectTo(`${ITS_URL}/logout?service=${location.origin}&relativeBackUrl=${routePath}`);
  }

  login(path: string = '/', redirectable = true): Observable<any> {
    const pathName = path.split('?')[0];
    const ticket = getParamFromQueryString('ticket');
    const queryStringWithoutTicket = getQueryStringWithoutParam('ticket');
    const url =
      pathName === location.pathname
        ? `${location.origin}${pathName}${encodeURIComponent(queryStringWithoutTicket)}`
        : `${location.origin}${pathName}`;
    if (ticket) {
      const serviceName = `${location.origin}${pathName}${encodeURIComponent(queryStringWithoutTicket)}`;
      return this.auth({ ticket, serviceName }).pipe(
        tap((authResponse: AuthResponseModel) => this._userService.setUserData(authResponse)),
        switchMap((_) => this._organizationsService.getUserOrganizations()),
        tap((res) => this._userService.setUserOrganizations(res)),
        switchMap((res) => this._userService.updateParticipationRequests()),
        switchMap((res) => this._userService.updateNewAccountDocumentsCounter()),
        map(() => {
          this.goTo(`${location.pathname}${queryStringWithoutTicket}`);
          return null;
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
    redirectTo(`${ITS_URL}/registration?redirect=${location.origin}${path}`);
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

  goTo(url: string): void {
    this._router.navigateByUrl(this._router.url.split('?')[0], { skipLocationChange: true }).then(() => {
      this._router.navigateByUrl(url);
    });
  }

  redirectExternalSsoAuth(url: string): void {
    location.assign(`${ITS_URL}/login?service=${url}`);
  }

  private isPathWithAuth(currentUrl: string): boolean {
    const urlWithoutQueryParams = currentUrl.split('?')[0];
    return pathsWithAuth.some((regEx) => regEx.test(urlWithoutQueryParams));
  }
}
