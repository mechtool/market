
import { Injectable } from '@angular/core';
import { Route, PreloadingStrategy } from '@angular/router';
import { timer, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Injectable()
export class DelayedPreloadingStrategy implements PreloadingStrategy {

  constructor() { }

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    const loadRoute = (delay: number) => (delay && !Number.isNaN(+delay))
      ? timer(delay).pipe(flatMap(_ => load()))
      : load();
    return route.data && route.data.preload
      ? loadRoute(route.data.delay)
      : of(null);
  }
}
