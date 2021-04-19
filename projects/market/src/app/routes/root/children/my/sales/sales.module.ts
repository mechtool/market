import { NgModule } from '@angular/core';
import { SalesComponent } from './sales.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesRoutingModule } from './sales-routing.module';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  AddressSearchFormComponent,
  CategoriesSettingComponent,
  CategorySearchFormComponent,
  OrganizationCategoriesSettingComponent,
  PriceListCreatingFormComponent,
  PriceListEditingFormComponent,
  PriceListTableComponent,
  PriceListViewFormComponent,
  WhiteListFormComponent,
} from './components';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { PipesModule } from '#shared/modules/pipes';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { OrderListModule } from '#shared/modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SalesRoutingModule,
    NzTabsModule,
    NzButtonModule,
    NzIconModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    PipesModule,
    NzPopconfirmModule,
    NzSelectModule,
    NzDatePickerModule,
    SharedDepsModule,
    NzTagModule,
    NzToolTipModule,
    NzCheckboxModule,
    NzAutocompleteModule,
    NzTreeSelectModule,
    NzNotificationModule,
    OrderListModule,
  ],
  declarations: [
    SalesComponent,
    AddressSearchFormComponent,
    CategoriesSettingComponent,
    CategorySearchFormComponent,
    OrganizationCategoriesSettingComponent,
    PriceListTableComponent,
    PriceListEditingFormComponent,
    PriceListCreatingFormComponent,
    PriceListViewFormComponent,
    WhiteListFormComponent,
  ]
})
export class SalesModule {
}
