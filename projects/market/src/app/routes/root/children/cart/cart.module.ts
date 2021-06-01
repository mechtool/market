import { NgModule } from '@angular/core';
import { CommonModule, PercentPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import {
  CartOrderComponent,
  CartOrderQtyCounterComponent,
  CartOrderV2Component,
  ImageUrlPipe,
  OrderDetailsComponent,
  OrderedProductsTableComponent,
  OrderOrRequestPipe,
  OrderSentComponent,
  OrderUnavailableComponent,
  OrderV2Service,
  RegisterOrderSentComponent,
  VatConverterPipe
} from './components';
import { CartModalService } from './cart-modal.service';
import { LOCAL_PROVIDER_TOKEN, NgZorroAntdMobileModule, ru_RU as ru_RU_Mobile } from 'ng-zorro-antd-mobile';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { OrderDetailsWithoutAuthComponent } from './components/order-v2/components/order-details-without-auth';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { OnlyNumberModule } from '#shared/modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzDropDownModule,
    NzTabsModule,
    NzToolTipModule,
    NzRadioModule,
    NzButtonModule,
    NzAutocompleteModule,
    NzModalModule,
    NzEmptyModule,
    NzDatePickerModule,
    SharedDepsModule,
    CartRoutingModule,
    NzInputModule,
    NgZorroAntdMobileModule,
    NzCheckboxModule,
    NzSelectModule,
    NzIconModule,
    OnlyNumberModule
  ],
  declarations: [
    CartComponent,
    CartOrderComponent,
    CartOrderV2Component,
    CartOrderQtyCounterComponent,
    OrderUnavailableComponent,
    OrderSentComponent,
    RegisterOrderSentComponent,
    ImageUrlPipe,
    OrderOrRequestPipe,
    VatConverterPipe,
    OrderedProductsTableComponent,
    OrderDetailsComponent,
    OrderDetailsWithoutAuthComponent,
  ],
  providers: [
    CartModalService,
    OrderV2Service,
    { provide: LOCAL_PROVIDER_TOKEN, useValue: ru_RU_Mobile },
    PercentPipe,
  ]
})
export class CartModule {
}
