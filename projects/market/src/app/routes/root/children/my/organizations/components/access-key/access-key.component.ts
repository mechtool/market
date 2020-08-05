import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { UserOrganizationModel, AccessKeyResponseModel } from '#shared/modules/common-services/models';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-access-key',
  templateUrl: './access-key.component.html',
  styleUrls: ['./access-key.component.scss'],
})
export class AccessKeyComponent implements OnInit {
  @Input() organization: UserOrganizationModel;
  @Input() accessKey: AccessKeyResponseModel;
  isAccessCodeCopied = false;

  get organizationName(): string {
    return this.organization?.organizationName || null;
  }

  get inn(): string {
    return this.organization?.legalRequisites?.inn || null;
  }

  get kpp(): string {
    return this.organization?.legalRequisites?.kpp || null;
  }

  get accessCode(): string {
    return this.accessKey?.accessCode || null;
  }

  get accessCodeExpirationDate(): string {
    return this.accessKey?.accessCodeExpirationDate || null;
  }

  constructor() {}

  ngOnInit() {}

  copyAccessCodeToClipboard() {
    const createCopy = (e : ClipboardEvent) => {
      e.clipboardData.setData('text/plain', this.accessCode);
      e.preventDefault();
    };
    document.addEventListener('copy', createCopy);
    document.execCommand('copy');
    document.removeEventListener('copy', createCopy);
    this.isAccessCodeCopied = true;
  }

}


