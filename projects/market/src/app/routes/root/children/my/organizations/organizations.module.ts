import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule, NzEmptyModule, NzCheckboxModule } from 'ng-zorro-antd';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { OrganizationsRoutingModule } from './organizations-routing.module';
import { OrganizationsComponent } from './organizations.component';
import { SingleOrganizationComponent } from './components/single-organization/single-organization.component';
import { ActiveOrganizationsComponent } from './components/active-organizations/active-organizations.component';
import { SentRequestsComponent } from './components/sent-requests/sent-requests.component';
import { RequisitesCheckerComponent } from './components/requisites-checker/requisites-checker.component';
import { OrganizationRegisterComponent } from './components/organization-register/organization-register.component';
import { OrganizationExistsComponent } from './components/organization-exists/organization-exists.component';
import { AccessKeyComponent } from './components/access-key/access-key.component';
import { OrganizationRequestStatusPipe } from './pipes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NzModalModule,
    NzButtonModule,
    NzEmptyModule,
    NzCheckboxModule,
    ReactiveFormsModule,
    OrganizationsRoutingModule,
  ],
  declarations: [
    OrganizationsComponent,
    ActiveOrganizationsComponent,
    SingleOrganizationComponent,
    SentRequestsComponent,
    RequisitesCheckerComponent,
    OrganizationRegisterComponent,
    OrganizationExistsComponent,
    AccessKeyComponent,
    OrganizationRequestStatusPipe,
  ],
})
export class OrganizationsModule {
}
