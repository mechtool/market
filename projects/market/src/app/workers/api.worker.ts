import { DoWork, ObservableWorker } from 'observable-webworker';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

@ObservableWorker()
export class ApiWorker implements DoWork<string, any> {
  constructor() {}

  public work(input$: Observable<string>): Observable<any> {
    return input$.pipe(
      switchMap((res) => {
        const obj = JSON.parse(res);
        return ajax({
          url: obj.url,
          method: obj.method,
          ...(obj.headers && { headers: obj.headers }),
          ...(obj.body && { body: obj.body }),
        });
      }),
      map((message) => message.response),
      catchError((e) => {
        const err = JSON.parse(JSON.stringify(e));
        return throwError(err);
      }),
    );
  }
}
