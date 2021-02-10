import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthOrRegDecisionMakerComponent } from './auth-or-reg-decision-maker.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';

@NgModule({
  imports: [CommonModule, RouterModule, NzButtonModule, SharedDepsModule],
  exports: [AuthOrRegDecisionMakerComponent],
  declarations: [AuthOrRegDecisionMakerComponent],
})
export class AuthOrRegDecisionMakerModule {}
