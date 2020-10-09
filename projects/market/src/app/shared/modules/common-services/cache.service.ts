import { Injectable, OnDestroy } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { ApiService } from './api.service';

const DEFAULT_CACHE_TIME = 1000 * 60 * 10;

@Injectable()
export class CacheService implements OnDestroy {
  private _cache: {
    [key: string]: Observable<any>;
  } = {};
  timeoutIds: number[] = [];

  constructor(private _apiService: ApiService) {}

  ngOnDestroy() {
    this.timeoutIds.forEach((id) => {
      clearTimeout(id);
    });
  }

  get(url: string, params: any, forceRequest = false): Observable<any> {
    const paramsPart = params ? JSON.stringify(params) : '';
    if (!this._cache[url + paramsPart] || forceRequest) {
      this._cache[url + paramsPart] = this._apiService
        .get<any>(url, { params })
        .pipe(
          shareReplay(1),
          catchError((err) => {
            return throwError(err);
          }),
        );
      setTimeout(() => {
        delete this._cache[url + paramsPart];
      }, DEFAULT_CACHE_TIME);
    }
    return this._cache[url + paramsPart];
  }

  get cache(): any {
    return this._cache;
  }
}
