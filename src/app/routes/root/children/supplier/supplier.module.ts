import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierListComponent, SupplierProductComponent, SupplierSingleComponent } from './components';
import { PipesModule, SearchBarModule, SupplierCardModule } from '#shared/modules';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';

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
  ],
  declarations: [
    SupplierListComponent,
    SupplierSingleComponent,
    SupplierProductComponent,
  ],
})
export class SupplierModule {
}
