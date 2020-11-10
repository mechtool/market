import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SorterComponent } from './sorter.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@NgModule({
  imports: [CommonModule, RouterModule, NzDropDownModule],
  exports: [SorterComponent],
  declarations: [SorterComponent],
})
export class SorterModule {}
