import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { environment } from '#environments/environment';
import {
  redirectTo,
  getQueryStringWithoutParam,
  getParamFromQueryString
} from '#shared/utils';
import { ApiService } from './api.service';
import { AuthRequestModel, AuthResponseModel } from './models';

const API_URL = environment.apiUrl;
const ITS_URL = environment.itsUrl;

@Injectable()
export class AuthService {
  userData$: BehaviorSubject<AuthResponseModel> = new BehaviorSubject(null);

  constructor(
    private _apiService: ApiService,
    private _router: Router,
  ) {}

  setUserData(data: any, fromNextTick = true): void {
    if (fromNextTick) {
      setTimeout(() => {
        this.userData$.next(data);
      }, 0);
    }
    if (!fromNextTick) {
      this.userData$.next(data);
    }
  }

  logout() {
    // TODO: необходимо пофиксить поведение https://login-dev.1c.ru, не воспринимается параметр service при logout
    redirectTo(`${ITS_URL}/logout?service=${location.origin}`);
  }

  login(path: string = ''): Observable<any> {
    const ticket = getParamFromQueryString('ticket');
    const url = `${location.origin}${path}`;
    if (!ticket) {
      this.redirectExternalSsoAuth(url);
    } else {
      const queryStringWithoutTicket = getQueryStringWithoutParam('ticket');
      const serviceName = `${location.origin}${location.pathname}${encodeURIComponent(queryStringWithoutTicket)}`;
      return this.auth({ ticket, serviceName })
        .pipe(
          map((authResponse: AuthResponseModel) => {
            this.setUserData(authResponse, false);
            this._goTo(`${location.pathname}${queryStringWithoutTicket}`);
            return true;
          })
        );
    }
  }

  auth(authRequest: AuthRequestModel): Observable<AuthResponseModel> {
    return this._apiService.post(`${API_URL}/auth`, {
      ticket: authRequest.ticket,
      serviceName: authRequest.serviceName,
    });
  }

  refresh(refreshToken: string): Observable<AuthResponseModel> {
    return this._apiService.post(`${API_URL}/auth/refresh`, { refreshToken });
  }

  openWindowItsUserProfilePage(): Window {
    return window.open(`${ITS_URL}/user/profile`);
  }

  private redirectExternalSsoAuth(url: string): void {
    location.assign(`${ITS_URL}/login?service=${url}`);
  }

  private _goTo(url: string): any {
    this._router.navigateByUrl(url);
  }

}
