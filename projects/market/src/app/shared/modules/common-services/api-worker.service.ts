import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { fromWorker } from 'observable-webworker';
import { UserStateService } from './user-state.service';

@Injectable()
export class ApiWorkerService {
  constructor(private _userStateService: UserStateService) {}

  request(method: any, url: string, body?: any): Observable<any> {
    let fullUrl = url;
    if (body.params.keys().length) {
      fullUrl = `${fullUrl}?${body.params.toString()}`;
    }
    const accessToken = this._userStateService.currentUser$.getValue()?.accessToken;
    const headers = {
      ...(accessToken && { authorization: `Bearer ${accessToken}` }),
    };
    const input$ = of(JSON.stringify({ method, headers, url: fullUrl }));
    return fromWorker(() => new Worker('../../../workers/api.worker', { type: 'module' }), input$);
  }

  get(url: string, body?: any): Observable<any> {
    return this.request('GET', url, body);
  }
}
