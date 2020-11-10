import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

@NgModule({
  imports: [CommonModule, RouterModule, NzBreadCrumbModule],
  exports: [BreadcrumbsComponent],
  declarations: [BreadcrumbsComponent],
})
export class BreadcrumbsModule {}
