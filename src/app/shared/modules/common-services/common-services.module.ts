import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';
import { BNetService } from './bnet.service';
import { AuthService } from './auth.service';
import { CacheService } from './cache.service';
import { CategoryService } from './category.service';
import { NavigationService } from './navigation.service';
import { ResponsiveService } from './responsive.service';
import { SuggestionService } from './suggestion.service';
import { ProductService } from './product.service';
import { OrganizationsService } from './organizations.service';
import { UserService } from './user.service';
import { LocalStorageService } from './local-storage.service';
import { LocationService } from './location.service';
import { SupplierService } from './supplier.service';

@NgModule({
  imports: [CommonModule],
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
        LocalStorageService,
        ResponsiveService,
        SuggestionService,
        ProductService,
        OrganizationsService,
        UserService,
        LocationService,
        SupplierService,
      ],
    };
  }
}
