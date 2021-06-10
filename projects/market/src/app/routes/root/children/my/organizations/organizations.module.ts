import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { OrganizationsRoutingModule } from './organizations-routing.module';
import { OrganizationsComponent } from './organizations.component';
import { AccessKeyStatusPipe, OrganizationRequestStatusPipe, PageHeaderPipe, PhoneFormattersPipe } from './pipes';
import { SingleOrganizationGuard } from './guards';
import { OrganizationViewComponent } from './components/organization-view/organization-view.component';
import { OrganizationUsersComponent } from './components/organization-users/organization-users.component';
import { UserRemovalVerifierComponent } from './components/user-removal-verifier/user-removal-verifier.component';
import { RequestDecisionMakerComponent } from './components/request-decision-maker/request-decision-maker.component';
import { OrganizationAccessKeysComponent } from './components/organization-access-keys/organization-access-keys.component';
import { AccessKeyRemovalVerifierComponent } from './components/access-key-removal-verifier/access-key-removal-verifier.component';
import { OrganizationRequestsComponent } from './components/organization-requests/organization-requests.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { OnlyNumberModule } from '#shared/modules/directives/input-only-number/input-only-number.module';
import {
  AccessKeyComponent,
  ActiveOrganizationsComponent,
  OrganizationManageComponent,
  SentRequestsComponent,
  SingleOrganizationComponent
} from './components';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NzModalModule,
    NzButtonModule,
    NzEmptyModule,
    NzCheckboxModule,
    SharedDepsModule,
    ReactiveFormsModule,
    OrganizationsRoutingModule,
    NzCollapseModule,
    NzToolTipModule,
    OnlyNumberModule,
    NzFormModule,
    NzInputModule,
  ],
  declarations: [
    OrganizationsComponent,
    ActiveOrganizationsComponent,
    SingleOrganizationComponent,
    SentRequestsComponent,
    OrganizationManageComponent,
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
    PageHeaderPipe,
  ],
  providers: [SingleOrganizationGuard],
})
export class OrganizationsModule {
}
