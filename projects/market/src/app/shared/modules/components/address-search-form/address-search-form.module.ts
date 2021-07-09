import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PipesModule } from '#shared/modules/pipes';
import { AddressSearchFormComponent } from './address-search-form.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NzButtonModule,
    PipesModule,
    NzAutocompleteModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule
  ],
  exports: [AddressSearchFormComponent],
  declarations: [AddressSearchFormComponent],
})
export class AddressSearchFormModule {
}
