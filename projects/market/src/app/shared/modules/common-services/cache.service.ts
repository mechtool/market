import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { ApiService } from './api.service';

const DEFAULT_CACHE_TIME = 1000 * 60 * 10;

@Injectable()
export class CacheService {
  private _cache: {
    [key: string]: Observable<any>;
  } = {};

  constructor(private _apiService: ApiService) {}

  get(url: string, forceRequest = false): Observable<any> {
    if (!this._cache[url] || forceRequest) {
      this._cache[url] = this._apiService.get<any>(url).pipe(
        shareReplay(1),
        catchError((err) => {
          return throwError(err);
        }),
      );
      setTimeout(() => {
        delete this._cache[url];
      }, DEFAULT_CACHE_TIME);
    }
    return this._cache[url];
  }

  get cache(): any {
    return this._cache;
  }
}
