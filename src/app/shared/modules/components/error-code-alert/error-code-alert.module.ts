import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd';
import { ErrorCodeAlertComponent } from './error-code-alert.component';

@NgModule({
  imports: [CommonModule, RouterModule, NzAlertModule],
  exports: [ErrorCodeAlertComponent],
  declarations: [ErrorCodeAlertComponent],
})
export class ErrorCodeAlertModule {}
