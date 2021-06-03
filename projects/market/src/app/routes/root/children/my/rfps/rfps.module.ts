import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { RfpsRoutingModule } from './rfps-routing.module';
import { OnlyNumberModule, PipesModule } from '#shared/modules';
import { RfpStatusPipe, OfferStatusPipe, RestrictionTypePipe } from './pipes';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { RfpsComponent } from './rfps.component';
import { RfpListComponent } from './components/rfp-list/rfp-list.component';
import { RfpViewComponent } from './components/rfp-view/rfp-view.component';
import { RfpEditComponent } from './components/rfp-edit/rfp-edit.component';
import { WhiteListFormComponent } from './components/white-list-form/white-list-form.component';
import { BarcodeFormComponent } from './components/barcodes-form/barcode-form.component';
import { OfferListComponent } from './components/offer-list/offer-list.component';
import { OfferViewComponent } from './components/offer-view/offer-view.component';
import { RfpsService } from './rfps.service';
import { ListEmptyComponent } from './components/list-empty/list-empty.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzRadioModule,
    NzCheckboxModule,
    NzTabsModule,
    NzButtonModule,
    NzDropDownModule,
    NzDatePickerModule,
    NzTagModule,
    NzIconModule,
    NzEmptyModule,
    NzToolTipModule,
    NzModalModule,
    NzInputModule,
    NzSelectModule,
    NzAutocompleteModule,
    NzPopconfirmModule,
    NzGridModule,
    RfpsRoutingModule,
    PipesModule,
    SharedDepsModule,
    OnlyNumberModule,
  ],
  declarations: [
    RfpsComponent,
    RfpListComponent,
    ListEmptyComponent,
    RfpViewComponent,
    RfpEditComponent,
    WhiteListFormComponent,
    BarcodeFormComponent,
    RestrictionTypePipe,
    RfpStatusPipe,
    OfferStatusPipe,
    OfferListComponent,
    OfferViewComponent,
  ],
  providers: [RfpsService],
})
export class RfpsModule {}
