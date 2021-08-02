import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '#shared/modules';
import { RootComponent } from './routes/root/root.component';
import { BreadcrumbsGuard, DelayedPreloadingStrategy } from '#shared/modules/setup-services';

const routes: Routes = [
  {
    path: '',
    canActivate: [BreadcrumbsGuard],
    runGuardsAndResolvers: 'always',
    component: RootComponent,
    children: [
      {
        path: '',
        data: { preload: true, delay : 1000},
        loadChildren: () => import('./routes/root/children/product/product.module').then((m) => m.ProductModule),
      },
      {
        path: 'category',
        data: { preload: true, delay : 1000},
        loadChildren: () => import('./routes/root/children/category/category.module').then((m) => m.CategoryModule),
      },
      {
        path: 'promo',
        data: { preload: true, delay : 1000},
        loadChildren: () => import('./routes/root/children/promo/promo.module').then((m) => m.PromoModule),
      },
      {
        path: 'p',
        data: { preload: true, delay : 1300},
        loadChildren: () => import('./shared/modules/components/pages/pages.module').then((m) => m.PagesModule),
      },
      {
        path: 'supplier',
        data: {preload: true, delay : 1300},
        loadChildren: () => import('./routes/root/children/supplier/supplier.module').then((m) => m.SupplierModule),
      },
      {
        path: 'cart',
        data: { preload: true, delay : 1300},
        loadChildren: () => import('./routes/root/children/cart/cart.module').then((m) => m.CartModule),
      },
      {
        path: 'blank',
        data: {preload: true, delay : 1500},
        loadChildren: () => import('./routes/root/children/blank/blank.module').then((m) => m.BlankModule),
      },
      {
        path: 'my',
        data: { preload: true, delay : 1500 },
        canActivate: [AuthGuard],
        children: [
          {
            path: 'orders',
            data: { preload: true, delay : 1500},
            loadChildren: () => import('./routes/root/children/my/orders/orders.module').then((m) => m.OrdersModule),
          },
          {
            path: 'sales',
            data: { preload: true, delay : 1500 },
            loadChildren: () => import('./routes/root/children/my/sales/sales.module').then((m) => m.SalesModule),
          },
          {
            path: 'organizations',
            data: { preload: true, delay : 1500},
            loadChildren: () => import('./routes/root/children/my/organizations/organizations.module').then((m) => m.OrganizationsModule),
          },
          {
            path: 'rfps',
            data: { preload: true, delay : 1500},
            loadChildren: () => import('./routes/root/children/my/rfps/rfps.module').then((m) => m.RfpsModule),
          },
          {
            path: '**',
            redirectTo: 'orders',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'about',
        data: { preload: true, delay : 1500 },
        loadChildren: () => import('./routes/root/children/about/about.module').then((m) => m.AboutModule),
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
    useHash: false,
    preloadingStrategy: DelayedPreloadingStrategy,
    relativeLinkResolution: 'legacy',
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    initialNavigation: 'enabled'
})
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
