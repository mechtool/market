import { MonoTypeOperatorFunction } from 'rxjs';
import { delay, retryWhen, scan, tap } from 'rxjs/operators';

export function delayedRetry<T>(delayNum: number, count = 1): MonoTypeOperatorFunction<T> {
  return (input) =>
    input.pipe(
      retryWhen((errors) =>
        errors.pipe(
          scan((acc, error) => ({ error, count: acc.count + 1 }), {
            count: 0,
            error: undefined as any,
          }),
          tap((current) => {
            if (current.count > count) {
              throw current.error;
            }
          }),
          delay(delayNum),
        ),
      ),
    );
}
