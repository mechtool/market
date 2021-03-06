import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  BreadcrumbsService,
  CategoryModel,
  CategoryService,
  OrganizationsService,
  ProductService,
  SpinnerService,
  TradeOffersService,
  UserService,
  UserStateService,
} from '#shared/modules/common-services';
import { BreadcrumbItemModel } from '#shared/modules/common-services/models';
import { of } from 'rxjs';
import { resizeBusinessStructure } from '#shared/utils';

/**
 * URL пути страниц без breadcrumbs
 * Регекспы по роутингу {@link http://forbeslindesay.github.io/express-route-tester/}
 */
const pathsObjectWithoutBreadcrumbs = {
  '/': /^\/$/i,
  '/blank': /^\/blank$/i,
  '/404': /^\/404$/i,
  '/500': /^\/500$/i,
  '/search': /^\/search$/i,
  '/supplier': /^\/supplier$/i,
  '/p/:path': /^\/p\/(?!promo|blog|about)([a-zA-Z0-9-_/]+)$/i,
};

/**
 * URL пути страниц с breadcrumbs
 * Регекспы по роутингу {@link http://forbeslindesay.github.io/express-route-tester/}
 */
const pathsObjectWithBreadcrumbs = {
  '/category': /^\/category$/i,
  '/category/:id': /^\/category\/(?:([^\/]+?))\/?$/i,
  '/product/:id': /^\/product\/(?:([^\/]+?))$/i,
  '/supplier/:supplierId': /^\/supplier\/(?:([^\/]+?))$/i,
  '/supplier/:supplierId/offer/:tradeOfferId': /^\/supplier\/(?:([^\/]+?))\/offer\/(?:([^\/]+?))\/?$/i,
  '/cart': /^\/cart$/i,
  '/about': /^\/about.*\/?$/i,
  '/p/about': /^\/p\/about$/i,
  '/p/blog': /^\/p\/blog$/i,
  '/p/promo': /^\/p\/promo$/i,
  '/promo/:id': /^\/promo\/(?:([^\/]+?))$/i,
  '/promo/:id/:subId': /^\/promo\/(?:([^\/]+?))\/(?:([^\/]+?))\/?$/i,
  '/my/orders': /^\/my\/orders$/i,
  '/my/sales': /^\/my\/sales$/i,
  '/my/sales/create': /^\/my\/sales\/create$/i,
  '/my/sales/edit/:priceListExternalId': /^\/my\/sales\/edit\/(?:([^\/]+?))$/i,
  '/my/organizations': /^\/my\/organizations$/i,
  '/my/organizations/:id': /^\/my\/organizations\/(?:([^\/]+?))\/?$/i,
  '/my/rfps': /^\/my\/rfps$/i,
  '/my/rfps/create': /^\/my\/rfps\/create$/i,
  '/my/rfps/edit/:id': /^\/my\/rfps\/edit\/(?:([^\/]+?))$/i,
};

/**
 * URL пути находящиеся под аутентификацией
 */
const pathsWithAuthentication = [/^\/supplier$/i];

/**
 * URL пути находящиеся под авторизацией
 */
const pathsWithAuthorization = [
  /^\/my\/orders$/i,
  /^\/my\/sales$/i,
  /^\/my\/sales\/create$/i,
  /^\/my\/sales\/edit\/(?:([^\/]+?))$/i,
  /^\/my\/rfps$/i,
  /^\/my\/rfps\/create$/i,
  /^\/my\/rfps\/edit\/(?:([^\/]+?))$/i
];

@Injectable()
export class BreadcrumbsGuard implements CanActivate {
  constructor(
    private _breadcrumbsService: BreadcrumbsService,
    private _categoryService: CategoryService,
    private _productService: ProductService,
    private _organizationsService: OrganizationsService,
    private _tradeOffersService: TradeOffersService,
    private _userService: UserService,
    private _userStateService: UserStateService,
    private _spinnerService: SpinnerService,
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const urlWithoutQueryParams = state.url.split('?')[0];
    const urlSplitted = urlWithoutQueryParams.split('/');
    let breadcrumbsItems = [];

    const isRouteWithoutBreadcrumb = Object.values(pathsObjectWithoutBreadcrumbs).some((regEx) => regEx.test(urlWithoutQueryParams));

    if (this.nextPageWithAuth(urlWithoutQueryParams)) {
      return true;
    }

    if (isRouteWithoutBreadcrumb) {
      this._breadcrumbsService.setVisible(false);
      this._breadcrumbsService.setItems([]);
      return true;
    }

    this._breadcrumbsService.setVisible(true);
    const foundEntry = Object.entries(pathsObjectWithBreadcrumbs).find((entry) => entry[1].test(urlWithoutQueryParams));
    switch (foundEntry?.[0]) {
      case '/category':
        breadcrumbsItems = [
          {
            label: 'Товары',
          },
        ];
        this._breadcrumbsService.setItems(breadcrumbsItems);
        return true;
      case '/category/:id':
        this._spinnerService.show();
        const categoryId = urlSplitted[2];
        return this._categoryService.getCategoryTree(categoryId).pipe(
          map((categories) => {
            this._spinnerService.hide();
            breadcrumbsItems = [
              {
                label: 'Товары',
                routerLink: '/category',
              },
            ];
            breadcrumbsItems.push(...this.breadcrumbsCategoryAncestors(categories));
            this._breadcrumbsService.setItems(breadcrumbsItems);
            return true;
          }),
          catchError((err) => {
            this._spinnerService.hide();
            this._breadcrumbsService.setVisible(false);
            this._breadcrumbsService.setItems([]);
            return of(true);
          }),
        );
      case '/product/:id':
        this._spinnerService.show();
        const productId = urlSplitted[2];
        return this._productService.getProductOffer(productId).pipe(
          switchMap((productOffer) => {
            return this._categoryService.getCategoryTree(productOffer.product.categoryId);
          }),
          map((categories) => {
            this._spinnerService.hide();
            breadcrumbsItems = this.breadcrumbsCategoryAncestors(categories);
            this._breadcrumbsService.setItems(breadcrumbsItems);
            return true;
          }),
          catchError((err) => {
            this._spinnerService.hide();
            this._breadcrumbsService.setVisible(false);
            this._breadcrumbsService.setItems([]);
            return of(true);
          }),
        );
      case '/supplier/:supplierId':
        const supplierId = urlSplitted[2];
        return this._organizationsService.getOrganization(supplierId).pipe(
          map((res) => {
            this._breadcrumbsService.setItems([
              {
                label: 'Поставщики',
                routerLink: '/supplier',
              },
              {
                label: `${resizeBusinessStructure(res.name)}`,
              },
            ]);
            return true;
          }),
          catchError((err) => {
            this._breadcrumbsService.setVisible(false);
            this._breadcrumbsService.setItems([]);
            return of(true);
          }),
        );
      case '/supplier/:supplierId/offer/:tradeOfferId':
        this._spinnerService.show();
        const tradeOfferId = urlSplitted[4];
        return this._tradeOffersService.get(tradeOfferId).pipe(
          switchMap((tradeOffer) => {
            const categoryId =
              tradeOffer.product.ref1cNomenclature?.categoryId || tradeOffer.product.supplierNomenclature?.ref1Cn.categoryId;
            return this._categoryService.getCategoryTree(categoryId);
          }),
          map((categories) => {
            this._spinnerService.hide();
            breadcrumbsItems = this.breadcrumbsCategoryAncestors(categories);
            this._breadcrumbsService.setItems(breadcrumbsItems);
            return true;
          }),
          catchError((err) => {
            this._spinnerService.hide();
            this._breadcrumbsService.setVisible(false);
            this._breadcrumbsService.setItems([]);
            return of(true);
          }),
        );
      case '/cart':
        breadcrumbsItems = [
          {
            label: 'Личный кабинет',
            routerLink: '/',
          },
          {
            label: 'Корзина',
          },
        ];
        this._breadcrumbsService.setItems(breadcrumbsItems);
        return true;
      case '/p/promo':
        breadcrumbsItems = [
          {
            label: 'Акции',
          },
        ];
        this._breadcrumbsService.setItems(breadcrumbsItems);
        return true;
      case '/promo/:id':
      case '/promo/:id/:subId':
        breadcrumbsItems = [
          {
            label: 'Акции',
            routerLink: '/p/promo',
          },
        ];
        this._breadcrumbsService.setItems(breadcrumbsItems);
        return true;
      case '/my/orders':
        breadcrumbsItems = [
          {
            label: 'Личный кабинет',
            routerLink: '/',
          },
          {
            label: 'Мои заказы',
          },
        ];
        this._breadcrumbsService.setItems(breadcrumbsItems);
        return true;
      case '/my/sales':
        breadcrumbsItems = [
          {
            label: 'Личный кабинет',
            routerLink: '/',
          },
          {
            label: 'Мои продажи',
          },
        ];
        this._breadcrumbsService.setItems(breadcrumbsItems);
        return true;
      case '/my/sales/create':
        breadcrumbsItems = [
          {
            label: 'Личный кабинет',
            routerLink: '/',
          },
          {
            label: 'Мои продажи',
            routerLink: '/my/sales',
          },
          {
            label: 'Новый прайс-лист',
          }
        ];
        this._breadcrumbsService.setItems(breadcrumbsItems);
        return true;
      case '/my/sales/edit/:priceListExternalId':
        breadcrumbsItems = [
          {
            label: 'Личный кабинет',
            routerLink: '/',
          },
          {
            label: 'Мои продажи',
            routerLink: '/my/sales',
          },
          {
            label: 'Редактирование прайс-листа',
          }
        ];
        this._breadcrumbsService.setItems(breadcrumbsItems);
        return true;
      case '/my/organizations':
        breadcrumbsItems = [
          {
            label: 'Мои организации',
            routerLink: '/my/organizations',
            queryParams: { tab: 'a' },
          },
        ];
        this._breadcrumbsService.setItems(breadcrumbsItems);
        return true;
      case '/my/organizations/:id':
        const organizationId = urlSplitted[3];
        return this._organizationsService.getOrganization(organizationId).pipe(
          map((org) => {
            this._breadcrumbsService.setItems([
              {
                label: 'Мои организации',
                routerLink: '/my/organizations',
                queryParams: { tab: 'a' },
              },
              {
                label: `${resizeBusinessStructure(org.name)}`,
                routerLink: `/my/organizations/${org.id}`,
              },
            ]);
            return true;
          }),
          catchError((err) => {
            this._breadcrumbsService.setVisible(false);
            this._breadcrumbsService.setItems([]);
            return of(true);
          }),
        );
      case '/p/about':
      case '/about': // todo Удалить когда переделаем на статическую страницу
        breadcrumbsItems = [
          {
            label: 'О сервисе',
          },
        ];
        this._breadcrumbsService.setItems(breadcrumbsItems);
        return true;
      case '/p/blog':
        breadcrumbsItems = [
          {
            label: 'Блог',
          },
        ];
        this._breadcrumbsService.setItems(breadcrumbsItems);
        return true;
      case '/my/rfps':
        breadcrumbsItems = [
          {
            label: 'Личный кабинет',
            routerLink: '/',
          },
          {
            label: 'Мои запросы',
            routerLink: '/my/rfps',
          },
        ];
        this._breadcrumbsService.setItems(breadcrumbsItems);
        return true;
      case '/my/rfps/create':
        breadcrumbsItems = [
          {
            label: 'Личный кабинет',
            routerLink: '/',
          },
          {
            label: 'Мои запросы',
            routerLink: '/my/rfps',
          },
          {
            label: 'Новый запрос',
          }
        ];
        this._breadcrumbsService.setItems(breadcrumbsItems);
        return true;
      case '/my/rfps/edit/:id':
        breadcrumbsItems = [
          {
            label: 'Личный кабинет',
            routerLink: '/',
          },
          {
            label: 'Мои запросы',
            routerLink: '/my/rfps',
          },
          {
            label: 'Редактирование запроса',
          }
        ];
        this._breadcrumbsService.setItems(breadcrumbsItems);
        return true;
      default:
        this._breadcrumbsService.setVisible(false);
        this._breadcrumbsService.setItems([]);
        return true;
    }
  }

  private breadcrumbsCategoryAncestors(categories: CategoryModel[]): BreadcrumbItemModel[] {
    return categories.reduce((accum, curr, ind) => {
      accum.push({
        label: curr.name,
        routerLink: `/category/${curr.id}`,
      });
      return accum;
    }, <BreadcrumbItemModel[]>[]);
  }

  private nextPageWithAuth(urlWithoutQueryParams: string): boolean {
    const nextPageWithAuthentication = pathsWithAuthentication.some((regEx) => regEx.test(urlWithoutQueryParams));
    const nextPageWithAuthorization = pathsWithAuthorization.some((regEx) => regEx.test(urlWithoutQueryParams));
    return (
      (nextPageWithAuthentication && !this._userStateService.currentUser$.getValue()) ||
      (nextPageWithAuthorization && !this._userService.organizations$.getValue()?.length)
    );
  }
}
