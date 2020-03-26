import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';
import { BNetService } from './bnet.service';
import { AuthService } from './auth.service';
import { CacheService } from './cache.service';
import { NavigationService } from './navigation.service';
import { ResponsiveService } from './responsive.service';
import { SuggestionService } from './suggestion.service';
import { ProductService } from './product.service';
import { LocalStorageService } from './local.storage.service';

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
        NavigationService,
        LocalStorageService,
        ResponsiveService,
        SuggestionService,
        ProductService,
      ],
    };
  }
}
