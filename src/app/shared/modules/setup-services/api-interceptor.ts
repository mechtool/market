import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { throwError, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  switchMap,
  tap,
  take
} from 'rxjs/operators';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private _injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('INTERCEPTED');
    return next.handle(req);
  }

}

