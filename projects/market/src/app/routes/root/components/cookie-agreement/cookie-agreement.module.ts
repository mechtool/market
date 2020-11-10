import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CookieAgreementComponent } from './cookie-agreement.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@NgModule({
  imports: [CommonModule, RouterModule, NzAlertModule],
  exports: [CookieAgreementComponent],
  declarations: [CookieAgreementComponent],
})
export class CookieAgreementModule {}
