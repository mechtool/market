import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { shareReplay, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable()
export class CacheService {
  private _cache: {
    [key: string]: Observable<any>,
  } = {};

  constructor(private _apiService: ApiService) { }

  get(url: string, forceRequest = false): Observable<any> {
    if (!this._cache[url] || forceRequest) {
      this._cache[url] = this._apiService.get<any>(url)
        .pipe(shareReplay(1), catchError((err) => {
          return throwError(err);
        }));
    }
    return this._cache[url];
  }

  get cache(): any {
    return this._cache;
  }

}
