import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PipesModule } from '#shared/modules/pipes';
import { EmptyOrganizationsInfoComponent } from './empty-organizations-info.component';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  imports: [CommonModule, RouterModule, NzButtonModule, PipesModule],
  exports: [EmptyOrganizationsInfoComponent],
  declarations: [EmptyOrganizationsInfoComponent],
})
export class EmptyOrganizationsInfoModule {}
