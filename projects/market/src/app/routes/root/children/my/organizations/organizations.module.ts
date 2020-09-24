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
import { OrganizationOperateComponent } from './components/organization-operate/organization-operate.component';
import { OrganizationExistsComponent } from './components/organization-exists/organization-exists.component';
import { AccessKeyComponent } from './components/access-key/access-key.component';
import { OrganizationRequestStatusPipe, AccessKeyStatusPipe, PhoneFormattersPipe } from './pipes';
import { SingleOrganizationGuard } from './guards';
import { OrganizationViewComponent } from './components/organization-view/organization-view.component';
import { OrganizationUsersComponent } from './components/organization-users/organization-users.component';
import { UserRemovalVerifierComponent } from './components/user-removal-verifier/user-removal-verifier.component';
import { RequestDecisionMakerComponent } from './components/request-decision-maker/request-decision-maker.component';
import { OrganizationAccessKeysComponent } from './components/organization-access-keys/organization-access-keys.component';
import { AccessKeyRemovalVerifierComponent } from './components/access-key-removal-verifier/access-key-removal-verifier.component';
import { OrganizationRequestsComponent } from './components/organization-requests/organization-requests.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NzModalModule,
    NzButtonModule,
    NzEmptyModule,
    NzCheckboxModule,
    NgxMaskModule,
    ReactiveFormsModule,
    OrganizationsRoutingModule,
  ],
  declarations: [
    OrganizationsComponent,
    ActiveOrganizationsComponent,
    SingleOrganizationComponent,
    SentRequestsComponent,
    RequisitesCheckerComponent,
    OrganizationOperateComponent,
    OrganizationExistsComponent,
    AccessKeyComponent,
    OrganizationViewComponent,
    OrganizationUsersComponent,
    UserRemovalVerifierComponent,
    OrganizationRequestsComponent,
    RequestDecisionMakerComponent,
    OrganizationAccessKeysComponent,
    AccessKeyRemovalVerifierComponent,
    OrganizationRequestStatusPipe,
    AccessKeyStatusPipe,
    PhoneFormattersPipe,
  ],
  providers: [SingleOrganizationGuard]
})
export class OrganizationsModule {
}
