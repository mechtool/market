import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BannerCardComponent } from './banner-card.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [BannerCardComponent],
  declarations: [BannerCardComponent],
})
export class BannerCardModule { }
