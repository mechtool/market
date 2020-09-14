import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromoRoutingModule } from './promo-routing.module';
import { PromoListComponent, PromoFirstOrderComponent, PromoSchoolOfficeComponent } from './components';
import { ProductModule } from '../product';

@NgModule({
  imports: [CommonModule, FormsModule, PromoRoutingModule, ProductModule],
  declarations: [PromoListComponent, PromoFirstOrderComponent, PromoSchoolOfficeComponent],
})
export class PromoModule {}
