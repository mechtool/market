import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromoRoutingModule } from './promo-routing.module';
import { PromoListComponent, PromoFirstOrderComponent, PromoSchoolOfficeComponent, PromoPodarokPolozhenieComponent, PromoPodarokComponent } from './components';
import { ProductModule } from '../product';
import { BannersModule } from '#shared/modules/components/banners/banner.module';

@NgModule({
  imports: [CommonModule, FormsModule, PromoRoutingModule, ProductModule, BannersModule],
  // tslint:disable-next-line:max-line-length
  declarations: [PromoListComponent, PromoFirstOrderComponent, PromoSchoolOfficeComponent, PromoPodarokPolozhenieComponent, PromoPodarokComponent],
})
export class PromoModule {}
