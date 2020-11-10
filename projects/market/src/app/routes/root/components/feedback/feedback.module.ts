import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FeedbackComponent } from './feedback.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FeedbackModalComponent } from './components';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  imports: [CommonModule, RouterModule, NzModalModule, ReactiveFormsModule, NzButtonModule],
  exports: [FeedbackComponent],
  declarations: [FeedbackComponent, FeedbackModalComponent],
})
export class FeedbackModule {}
