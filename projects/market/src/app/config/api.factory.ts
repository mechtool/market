import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService, CartService, CookieService, UserService } from '#shared/modules/common-services';
import { of, zip } from 'rxjs';

export function ApiFactory(
  userService: UserService,
  cartService: CartService,
  authService: AuthService,
  cookieService: CookieService,
): () => Promise<any> {
  return (): Promise<any> => {
    return init(userService, cartService, authService, cookieService);
  };
}

function init(
  userService: UserService,
  cartService: CartService,
  authService: AuthService,
  cookieService: CookieService,
) {
  return new Promise((resolve, reject) => {
    return zip(
      setCart(cartService),
      userService.updateUserCategories(),
    ).pipe(
      map(res => cookieService.isUserStatusCookieAuthed),
      switchMap((res) => {
        userService.watchUserDataChangesForUserStatusCookie();
        return res ? authService.login(location.pathname, false) : of(null);
      })
    ).subscribe((res) => {
      if (res) {
        authService.redirectExternalSsoAuth(res);
      }
      if (!res) {
        resolve();
      }
    }, reject);
  });
}

function setCart(cartService: CartService) {
  if (!cartService.hasCart()) {
    return cartService.createCart().pipe(
      switchMap(_ => cartService.setActualCartData()),
      // todo Сделал временное решение, чтобы создавалась новая корзина если 500 ошибка при получении созданной
      catchError(_ => cartService.setActualCartData(true)),
      map(_ => of(true)));
  }
  if (cartService.hasCart()) {
    return cartService.setActualCartData().pipe(
      // todo Сделал временное решение, чтобы создавалась новая корзина если 500 ошибка при получении созданной
      catchError(_ => cartService.setActualCartData(true)),
      map(_ => of(true))
    );
  }
}
