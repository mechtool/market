import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd';
import { PipesModule } from '#shared/modules/pipes';
import { AuthDecisionMakerComponent } from './auth-decision-maker.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NzButtonModule,
    PipesModule,
  ],
  exports: [AuthDecisionMakerComponent],
  declarations: [AuthDecisionMakerComponent],
})
export class AuthDecisionMakerModule {
}
