import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SorterComponent } from './sorter.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, RouterModule, NzDropDownModule, NzSelectModule, ReactiveFormsModule],
  exports: [SorterComponent],
  declarations: [SorterComponent],
})
export class SorterModule {
}
