import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PipesModule } from '#shared/modules/pipes';
import { SearchCounterpartyComponent } from './search-counterparty.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ReactiveFormsModule } from '@angular/forms';
import { OnlyNumberModule } from '#shared/modules/directives/input-only-number/input-only-number.module';

@NgModule({
  imports: [CommonModule, RouterModule, NzButtonModule, PipesModule, ReactiveFormsModule, OnlyNumberModule],
  exports: [SearchCounterpartyComponent],
  declarations: [SearchCounterpartyComponent],
})
export class SearchCounterpartyModule {
}
