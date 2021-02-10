import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PipesModule } from '#shared/modules/pipes';
import { AuthOrOrderDecisionMakerComponent } from './auth-or-order-decision-maker.component';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  imports: [CommonModule, RouterModule, NzButtonModule, PipesModule],
  exports: [AuthOrOrderDecisionMakerComponent],
  declarations: [AuthOrOrderDecisionMakerComponent],
})
export class AuthOrOrderDecisionMakerModule {}
