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
import {
  AuthRequestModel,
  AuthRefreshRequestModel,
  AuthResponseModel,
} from './models';

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

  logout(path: string = '/') {
    redirectTo(`${ITS_URL}/logout?service=${location.origin}&relativeBackUrl=${path}`);
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
            this.setUserData(authResponse, false);
            this.goTo(`${location.pathname}${queryStringWithoutTicket}`);
            return true;
          })
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
