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
        data: { preload: false },
        loadChildren: () => import('./routes/root/children/product/product.module').then((m) => m.ProductModule),
      },
      {
        path: 'category',
        data: { preload: false },
        loadChildren: () => import('./routes/root/children/category/category.module').then((m) => m.CategoryModule),
      },
      {
        path: 'promo',
        data: { preload: false },
        loadChildren: () => import('./routes/root/children/promo/promo.module').then((m) => m.PromoModule),
      },
      {
        path: 'supplier',
        data: { preload: false },
        loadChildren: () => import('./routes/root/children/supplier/supplier.module').then((m) => m.SupplierModule),
      },
      {
        path: 'cart',
        data: { preload: false },
        loadChildren: () => import('./routes/root/children/cart/cart.module').then((m) => m.CartModule),
      },
      {
        path: 'blank',
        data: { preload: false },
        loadChildren: () => import('./routes/root/children/blank/blank.module').then((m) => m.BlankModule),
      },
      {
        path: 'my',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'orders',
            data: { preload: false },
            loadChildren: () => import('./routes/root/children/my/orders/orders.module').then((m) => m.OrdersModule),
          },
          {
            path: 'organizations',
            data: { preload: false },
            loadChildren: () => import('./routes/root/children/my/organizations/organizations.module').then((m) => m.OrganizationsModule),
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
        data: { preload: false },
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
      relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
