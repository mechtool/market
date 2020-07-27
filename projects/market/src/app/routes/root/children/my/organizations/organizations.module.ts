import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrganizationsRoutingModule } from './organizations-routing.module';
import { OrganizationsComponent } from './organizations.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OrganizationsRoutingModule,
  ],
  declarations: [
    OrganizationsComponent,
  ],
})
export class OrganizationsModule {
}
