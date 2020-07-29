import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';
import { BNetService } from './bnet.service';
import { AuthService } from './auth.service';
import { CacheService } from './cache.service';
import { CategoryService } from './category.service';
import { NavigationService } from './navigation.service';
import { BreadcrumbsService } from './breadcrumbs.service';
import { ResponsiveService } from './responsive.service';
import { SuggestionService } from './suggestion.service';
import { ProductService } from './product.service';
import { OrganizationsService } from './organizations.service';
import { UserService } from './user.service';
import { LocalStorageService } from './local-storage.service';
import { CookieService } from './cookie.service';
import { LocationService } from './location.service';
import { SupplierService } from './supplier.service';
import { TradeOffersService } from './trade-offers.service';
import { CartService } from './cart.service';
import { EdiService } from './edi.service';
import { NotificationsService } from './notifications.service';
import { NzMessageModule } from 'ng-zorro-antd';

@NgModule({
  imports: [
    CommonModule,
    NzMessageModule,
  ],
})
export class CommonServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CommonServicesModule,
      providers: [
        ApiService,
        BNetService,
        AuthService,
        CacheService,
        CategoryService,
        NavigationService,
        BreadcrumbsService,
        LocalStorageService,
        CookieService,
        ResponsiveService,
        SuggestionService,
        ProductService,
        OrganizationsService,
        UserService,
        LocationService,
        SupplierService,
        TradeOffersService,
        CartService,
        EdiService,
        NotificationsService,
      ],
    };
  }
}
