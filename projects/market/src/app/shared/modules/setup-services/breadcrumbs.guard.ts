import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  BreadcrumbsService,
  CategoryModel,
  CategoryService,
  OrganizationsService,
  ProductService,
  TradeOffersService,
  UserService,
} from '#shared/modules/common-services';
import { BreadcrumbItemModel } from '#shared/modules/common-services/models';
import { of } from 'rxjs';

/**
 * URL пути страниц без breadcrumbs
 * Регекспы по роутингу {@link http://forbeslindesay.github.io/express-route-tester/}
 */
const pathsObjectWithoutBreadcrumbs = {
  '/': /^\/$/i,
  '/404': /^\/404$/i,
  '/500': /^\/500$/i,
  '/search': /^\/search$/i,
  '/supplier': /^\/supplier$/i,
};

/**
 * URL пути страниц с breadcrumbs
 * Регекспы по роутингу {@link http://forbeslindesay.github.io/express-route-tester/}
 */
const pathsObjectWithBreadcrumbs = {
  '/category/:categoryId': /^\/category\/(?:([^\/]+?))$/i,
  '/product/:id': /^\/product\/(?:([^\/]+?))$/i,
  '/supplier/:supplierId': /^\/supplier\/(?:([^\/]+?))$/i,
  '/supplier/:supplierId/offer/:tradeOfferId': /^\/supplier\/(?:([^\/]+?))\/offer\/(?:([^\/]+?))\/?$/i,
  '/cart': /^\/cart$/i,
  '/promo': /^\/promo$/i,
  '/promo/:id': /^\/promo\/(?:([^\/]+?))$/i,
  '/my/orders': /^\/my\/orders$/i,
  '/my/organizations': /^\/my\/organizations$/i,
  '/my/organizations/:id': /^\/my\/organizations\/(?:([^\/]+?))\/?$/i,
};

/**
 * URL пути находящиеся под аутентификацией
 */
const pathsWithAuthentication = [/^\/supplier$/i];

/**
 * URL пути находящиеся под авторизацией
 */
const pathsWithAuthorization = [/^\/my\/orders$/i];

@Injectable()
export class BreadcrumbsGuard implements CanActivate {
  constructor(
    private _breadcrumbsService: BreadcrumbsService,
    private _categoryService: CategoryService,
    private _productService: ProductService,
    private _organizationsService: OrganizationsService,
    private _tradeOffersService: TradeOffersService,
    private _userService: UserService,
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
    switch (foundEntry[0]) {
      case '/category/:categoryId':
        const categoryId = urlSplitted[2];
        return this._categoryService.getCategoryTree(categoryId).pipe(
          map((categories) => {
            breadcrumbsItems = this.breadcrumbsCategoryAncestors(categories);
            this._breadcrumbsService.setItems(breadcrumbsItems);
            return true;
          }),
          catchError((err) => {
            this._breadcrumbsService.setVisible(false);
            this._breadcrumbsService.setItems([]);
            return of(true);
          }),
        );
      case '/product/:id':
        const productId = urlSplitted[2];
        return this._productService.getProductOffer(productId).pipe(
          switchMap((productOffer) => {
            return this._categoryService.getCategoryTree(productOffer.product.categoryId);
          }),
          map((categories) => {
            breadcrumbsItems = this.breadcrumbsCategoryAncestors(categories);
            this._breadcrumbsService.setItems(breadcrumbsItems);
            return true;
          }),
          catchError((err) => {
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
                label: `${res.name}`,
                routerLink: `/supplier/${res.id}`,
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
        const tradeOfferId = urlSplitted[4];
        return this._tradeOffersService.get(tradeOfferId).pipe(
          switchMap((tradeOffer) => {
            const categoryId =
              tradeOffer.product.ref1cNomenclature?.categoryId || tradeOffer.product.supplierNomenclature?.ref1Cn.categoryId;
            return this._categoryService.getCategoryTree(categoryId);
          }),
          map((categories) => {
            breadcrumbsItems = this.breadcrumbsCategoryAncestors(categories);
            this._breadcrumbsService.setItems(breadcrumbsItems);
            return true;
          }),
          catchError((err) => {
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
      case '/promo':
        breadcrumbsItems = [
          {
            label: 'Акции',
          },
        ];
        this._breadcrumbsService.setItems(breadcrumbsItems);
        return true;
      case '/promo/:id':
        breadcrumbsItems = [
          {
            label: 'Акции',
            routerLink: '/promo',
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
          map((res) => {
            this._breadcrumbsService.setItems([
              {
                label: 'Мои организации',
                routerLink: '/my/organizations',
                queryParams: { tab: 'a' },
              },
              {
                label: `${res.name}`,
                routerLink: `/my/organizations/${res.id}`,
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
      default:
        this._breadcrumbsService.setVisible(false);
        this._breadcrumbsService.setItems([]);
        return true;
    }
  }

  private breadcrumbsCategoryAncestors(categories: CategoryModel[]): BreadcrumbItemModel[] {
    return categories.reduce((accum, curr) => {
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
      (nextPageWithAuthentication && !this._userService.userData$.getValue()) ||
      (nextPageWithAuthorization && !this._userService.organizations$.getValue()?.length)
    );
  }
}
