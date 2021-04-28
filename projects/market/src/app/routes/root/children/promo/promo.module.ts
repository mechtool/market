import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromoRoutingModule } from './promo-routing.module';
import {
  PromoFirstOrderComponent,
  PromoPodarokComponent,
  PromoPodarokParticipantsListComponent,
  PromoPodarokPolozhenieComponent,
  PromoSchoolOfficeComponent
} from './components';
import { ProductModule } from '../product';
import { BannersModule } from '#shared/modules/components/banners/banner.module';
import { PipesModule } from '#shared/modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PromoRoutingModule,
    ProductModule,
    BannersModule,
    PipesModule
  ],
  declarations: [
    PromoFirstOrderComponent,
    PromoSchoolOfficeComponent,
    PromoPodarokPolozhenieComponent,
    PromoPodarokParticipantsListComponent,
    PromoPodarokComponent
  ],
})
export class PromoModule {
}
