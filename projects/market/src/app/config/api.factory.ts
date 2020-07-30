import { switchMap, map, tap } from 'rxjs/operators';
import { UserService, CartService, AuthService, CookieService } from '#shared/modules/common-services';
import { zip, of } from 'rxjs';

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
      map(_ => of(true))
    );
  }
  if (cartService.hasCart()) {
    return cartService.setActualCartData().pipe(map(_ => of(true)));
  }
}
