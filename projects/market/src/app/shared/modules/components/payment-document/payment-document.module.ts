import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaymentDocumentComponent } from './payment-document.component';
import { PipesModule } from '#shared/modules/pipes';
import { CounterPartLinePipe } from './pipes/counterpart-line.pipe';

@NgModule({
  imports: [CommonModule, RouterModule, PipesModule],
  exports: [PaymentDocumentComponent],
  declarations: [PaymentDocumentComponent, CounterPartLinePipe],
})
export class PaymentDocumentModule {}
