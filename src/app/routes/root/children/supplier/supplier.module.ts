import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierListComponent, SupplierProductComponent, SupplierSingleComponent } from './components';
import {
  AboutSupplierModule,
  PipesModule,
  ProductDescriptionModule,
  ProductGalleryModule,
  ProductOrderModule,
  SearchBarModule,
  SupplierCardModule,
  TermsOfSaleModule,
  CardModule,
} from '#shared/modules';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SupplierRoutingModule,
    SearchBarModule,
    SupplierCardModule,
    InfiniteScrollModule,
    NzSpinModule,
    NzIconModule,
    PipesModule,
    ProductGalleryModule,
    NzTabsModule,
    ProductDescriptionModule,
    TermsOfSaleModule,
    AboutSupplierModule,
    ProductOrderModule,
    CardModule,
  ],
  declarations: [
    SupplierListComponent,
    SupplierSingleComponent,
    SupplierProductComponent,
  ],
})
export class SupplierModule {
}
