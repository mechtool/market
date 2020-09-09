import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineClampDirective } from './line-clamp.directive';

@NgModule({
  imports: [CommonModule],
  exports: [LineClampDirective],
  declarations: [LineClampDirective],
})
export class LineClampModule {}
