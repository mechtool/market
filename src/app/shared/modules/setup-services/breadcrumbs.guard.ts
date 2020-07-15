import { Injectable } from '@angular/core';
import {
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  CanActivate,
} from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { BreadcrumbsService } from '#shared/modules/common-services/breadcrumbs.service';
import { CategoryService } from '#shared/modules/common-services/category.service';
import { BreadcrumbItemModel } from '#shared/modules/common-services/models/breadcrumb-item.model';
import { ProductService } from '#shared/modules/common-services/product.service';
import { ProductDto } from '../common-services/models';
import { OrganizationsService } from '../common-services/organizations.service';
import { TradeOffersService } from '../common-services/trade-offers.service';
import { of } from 'rxjs';

@Injectable()
export class BreadcrumbsGuard implements CanActivate {
  constructor(
    private _breadcrumbsService: BreadcrumbsService,
    private _categoryService: CategoryService,
    private _productService: ProductService,
    private _organizationsService: OrganizationsService,
    private _tradeOffersService: TradeOffersService,
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const urlWithoutQueryParams = state.url.split('?')[0];
    const urlSplitted = urlWithoutQueryParams.split('/');
    let breadcrumbsItems = [];

    // Регекспы по роутингу http://forbeslindesay.github.io/express-route-tester/
    const pathsObjectWithoutBreadcrumbs = {
      '/': /^\/$/i,
      '/404': /^\/404$/i,
      '/500': /^\/500$/i,
      '/search': /^\/search$/i,
      '/supplier': /^\/supplier$/i,
      '/checkout': /^\/checkout$/i,
    };

    const pathsObjectWithBreadcrumbs = {
      '/category/:categoryId': /^\/category\/(?:([^\/]+?))$/i,
      '/product/:id': /^\/product\/(?:([^\/]+?))$/i,
      '/supplier/:supplierId': /^\/supplier\/(?:([^\/]+?))$/i,
      '/supplier/:supplierId/offer/:tradeOfferId': /^\/supplier\/(?:([^\/]+?))\/offer\/(?:([^\/]+?))\/?$/i,
      '/about': /^\/about$/i,
      '/cart': /^\/cart$/i,
      '/my/orders': /^\/my\/orders$/i,
      '/my/organizations': /^\/my\/organizations$/i,
    };

    const isRouteWithoutBreadcrumb = Object.values(pathsObjectWithoutBreadcrumbs).some(regEx => regEx.test(urlWithoutQueryParams));

    if (isRouteWithoutBreadcrumb) {
      this._breadcrumbsService.setVisible(false);
      this._breadcrumbsService.setItems([]);
      return true;
    } else {
      this._breadcrumbsService.setVisible(true);
      const foundEntry = Object.entries(pathsObjectWithBreadcrumbs).find(entry => entry[1].test(urlWithoutQueryParams));
      switch(foundEntry[0]) {
        case '/category/:categoryId':
          const categoryId = urlSplitted[2];
          return this._categoryService.getCategoryTree(categoryId).pipe(
            map((res) => {
              breadcrumbsItems = res.reduce(
                (accum, curr) => {
                  accum.push({
                    label: curr.name,
                    routerLink: `/category/${curr.id}`,
                  });
                  return accum;
                },
                <BreadcrumbItemModel[]>[
                  {
                    label: 'Каталог',
                  },
                ]
              );
              this._breadcrumbsService.setItems(breadcrumbsItems);
              return true
            }),
            catchError((err) => {
              this._breadcrumbsService.setVisible(false);
              this._breadcrumbsService.setItems([]);
              return of(true);
            })
          )
        case '/product/:id':
          const productId = urlSplitted[2];
          return this._productService.getProductOffer(productId).pipe(
            map((res) => {
              const product = ProductDto.fromProductOffer(res.product);
              const breadcrumbsItems = [
                {
                  label: 'Личный кабинет',
                  routerLink: '/'
                },
                {
                  label: 'Товары',
                  routerLink: `/search`
                },
                {
                  label: product.productName,
                  routerLink: `/product/${productId}`
                },
              ];
              this._breadcrumbsService.setItems(breadcrumbsItems);
              return true;
            }),
            catchError((err) => {
              this._breadcrumbsService.setVisible(false);
              this._breadcrumbsService.setItems([]);
              return of(true);
            })
          );
        case '/supplier/:id':
          const supplierId = urlSplitted[2];
          return this._organizationsService.getOrganization(supplierId).pipe(
            map((res) => {
              this._breadcrumbsService.setItems([
                {
                  label: 'Поставщики',
                  routerLink: '/supplier'
                },
                {
                  label: `${res.name}`,
                  routerLink: `/supplier/${res.id}`
                },
              ]);
              return true;
            }),
            catchError((err) => {
              this._breadcrumbsService.setVisible(false);
              this._breadcrumbsService.setItems([]);
              return of(true);
            })
          );
        case '/supplier/:id/offer/:tradeOfferId':
          const tradeOfferId = urlSplitted[4];
          return this._tradeOffersService.get(tradeOfferId).pipe(
            map((res) => {
              this._breadcrumbsService.setItems([
                {
                  label: 'Поставщики',
                  routerLink: '/supplier'
                },
                {
                  label: `${res.supplier.name}`,
                  routerLink: `/supplier/${res.supplier.bnetInternalId}/offer`
                },
                {
                  label: res.product.supplierNomenclature?.productName || res.product.ref1cNomenclature?.productName,
                  routerLink: `/supplier/${res.supplier.bnetInternalId}/offer/${res.id}`
                },
              ]);
              return true;
            }),
            catchError((err) => {
              this._breadcrumbsService.setVisible(false);
              this._breadcrumbsService.setItems([]);
              return of(true);
            })
          );
        case '/about':
          breadcrumbsItems = [
            {
              label: 'Личный кабинет',
              routerLink: '/'
            },
            {
              label: 'О проекте 1С:Бизнес-сеть',
            }
          ];
          this._breadcrumbsService.setItems(breadcrumbsItems);
          return true
        case '/cart':
          breadcrumbsItems = [
            {
              label: 'Личный кабинет',
              routerLink: '/'
            },
            {
              label: 'Корзина',
            }
          ];
          this._breadcrumbsService.setItems(breadcrumbsItems);
          return true
        case '/my/orders':
          breadcrumbsItems = [
            {
              label: 'Личный кабинет',
              routerLink: '/'
            },
            {
              label: 'Мои заказы',
            }
          ];
          this._breadcrumbsService.setItems(breadcrumbsItems);
          return true
        case '/my/organizations':
          breadcrumbsItems = [
            {
              label: 'Личный кабинет',
              routerLink: '/'
            },
            {
              label: 'Мои организации',
            }
          ];
          this._breadcrumbsService.setItems(breadcrumbsItems);
          return true
        default:
          this._breadcrumbsService.setVisible(false);
          this._breadcrumbsService.setItems([]);
          return true;
      }
    }

  }
}

