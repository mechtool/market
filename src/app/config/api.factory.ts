import { switchMap, map } from 'rxjs/operators';
import { UserService, CartService } from '#shared/modules/common-services';
import { zip, of } from 'rxjs';

export function ApiFactory(
  userService: UserService,
  cartService: CartService,
): () => Promise<any> {
  return (): Promise<any> => {
    return init(userService, cartService);
  };
}

function init(
  userService: UserService,
  cartService: CartService,
) {
  return new Promise((resolve, reject) => {
    return zip(
      setCart(cartService),
      userService.updateUserCategories(),
    ).subscribe(resolve, reject);
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
