import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromoRoutingModule } from './promo-routing.module';
import {
  PromoFirstOrderComponent,
  PromoListComponent,
  PromoPodarokComponent,
  PromoPodarokParticipantsListComponent,
  PromoPodarokPolozhenieComponent,
  PromoSchoolOfficeComponent
} from './components';
import { ProductModule } from '../product';
import { BannersModule } from '#shared/modules/components/banners/banner.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PromoRoutingModule,
    ProductModule,
    BannersModule
  ],
  declarations: [
    PromoListComponent,
    PromoFirstOrderComponent,
    PromoSchoolOfficeComponent,
    PromoPodarokPolozhenieComponent,
    PromoPodarokParticipantsListComponent,
    PromoPodarokComponent
  ],
})
export class PromoModule {
}
