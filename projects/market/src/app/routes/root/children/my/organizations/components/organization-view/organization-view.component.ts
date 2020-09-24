import { Input, Output, Component, EventEmitter, OnInit } from '@angular/core';
import { OrganizationResponseModel } from '#shared/modules/common-services/models/organization-response.model';
import { Router } from '@angular/router';
import { stringToHex } from '#shared/utils';

@Component({
  selector: 'market-organization-view',
  templateUrl: './organization-view.component.html',
  styleUrls: [
    './organization-view.component.scss',
    './organization-view.component-576.scss',
  ],
})
export class OrganizationViewComponent implements OnInit {
  @Input() organizationData: OrganizationResponseModel;
  @Input() isAdmin: boolean;
  @Output() editOrganizationChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private _router: Router){
  }

  ngOnInit() {
  }

  setHexColor(str: string): string {
    return stringToHex(str);
  }

  goToSupplierStore() {
    this._router.navigateByUrl(`supplier/${this.organizationData?.id}`);
  }

  editProfile() {
    this.editOrganizationChange.emit(true);
  }

}

