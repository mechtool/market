import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpResponse,
  HttpEvent,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import {
  map,
  catchError,
  filter,
} from 'rxjs/operators';

@Injectable()
export class ApiService {

  constructor(private _http: HttpClient) { }

  request(method: any, url: string, body?: any, init?: any) {
    let req = null;
    if (body) {
      req = new HttpRequest(method, url, body, init);
    } else {
      req = new HttpRequest(method, url, init);
    }
    return this._http.request(req)
      .pipe(
        filter((event: HttpEvent<any>) => event instanceof HttpResponse),
        map((res: HttpResponse<any>) => res.body),
        catchError((error) => {
          return throwError(error);
        }),
      );
  }

  get<T>(url: string, init?: any) {
    return this.request('GET', url, init);
  }

  post<T>(url: string, body?: any, init?: any) {
    return this.request('POST', url, body, init);
  }

  put<T>(url: string, body?: any, init?: any) {
    return this.request('PUT', url, body, init);
  }

  delete<T>(url: string, _init?: any) {
    let init = null;
    if (!_init) {
      init = { responseType: 'text' };
    } else {
      init = _init;
      if (!init.responseType) {
        init.responseType = 'text';
      }
    }
    return this.request('DELETE', url, init);
  }

}
