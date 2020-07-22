import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from '#environments/environment';
import {
  redirectTo,
  getQueryStringWithoutParam,
  getParamFromQueryString
} from '#shared/utils';
import { ApiService } from './api.service';
import {
  AuthRequestModel,
  AuthRefreshRequestModel,
  AuthResponseModel,
} from './models';
import { UserService } from './user.service';

const API_URL = environment.apiUrl;
const ITS_URL = environment.itsUrl;

@Injectable()
export class AuthService {

  constructor(
    private _apiService: ApiService,
    private _userService: UserService,
    private _router: Router,
  ) {}


  logout(path: string = '/') {
    const routePath = path.includes('/supplier') ? '/' : path;
    redirectTo(`${ITS_URL}/logout?service=${location.origin}&relativeBackUrl=${routePath}`);
  }

  login(path: string = '/'): Observable<any> {
    const pathName = path.split('?')[0];
    const ticket = getParamFromQueryString('ticket');
    const queryStringWithoutTicket = getQueryStringWithoutParam('ticket');
    const url = `${location.origin}${pathName}${encodeURIComponent(queryStringWithoutTicket)}`;
    if (!ticket) {
      this.redirectExternalSsoAuth(url);
    } else {
      const serviceName = `${location.origin}${pathName}${encodeURIComponent(queryStringWithoutTicket)}`;
      return this.auth({ ticket, serviceName })
        .pipe(
          map((authResponse: AuthResponseModel) => {
            this._userService.setUserData(authResponse, false);
            this._userService.updateUserOrganizations();
            this.goTo(`${location.pathname}${queryStringWithoutTicket}`);
            return true;
          }),
        );
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

  goTo(url: string): any {
    this._router.navigateByUrl(url);
  }

  private redirectExternalSsoAuth(url: string): void {
    location.assign(`${ITS_URL}/login?service=${url}`);
  }


}
