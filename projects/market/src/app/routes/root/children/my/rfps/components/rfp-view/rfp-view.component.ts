import { Component, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import {
  RfpItemResponseAttachmentModel,
  RfpItemResponseModel,
  RfpItemResponsePositionModel,
} from '#shared/modules/common-services/models/rfp-item-response.model';
import {CounterpartyResponseModel, OrganizationResponseModel, UserOrganizationModel} from '#shared/modules';
import { saveAs } from 'file-saver';
import { getBase64MimeType } from '#shared/utils';

@Component({
  selector: 'market-rfp-view',
  templateUrl: './rfp-view.component.html',
  styleUrls: [
    './rfp-view.component.scss',
    './rfp-view.component-768.scss',
  ]
})
export class RfpViewComponent {
  restrictionTypeOptions = [
    { label: 'Всем', value: null },
    { label: 'Всем кроме', value: 'BLACK_LIST' },
    { label: 'Только', value: 'WHITE_LIST' },
  ];
  documentOrderNumber: string = null;
  selectedOrganization: UserOrganizationModel = null;
  dateLastUpdated: string = null;
  datePlaced: string = null;
  dateCancelled: string = null;
  audienceRestrictionType: string = null;
  audienceParties: CounterpartyResponseModel[] = null;
  attachments: RfpItemResponseAttachmentModel[] = null;
  positions: RfpItemResponsePositionModel[] = null;
  dateCollectingFrom: string = null;
  dateCollectingTo: string = null;
  dateConsideringTo: string = null;
  deliveryRegionName: string = null;
  vatDeductible = false;
  contactName: string = null;
  contactPhone: string = null;
  contactEmail: string = null;

  // tslint:disable-next-line:max-line-length
  @Input() set configuration(conf: { rfpData: RfpItemResponseModel; userOrganizations: UserOrganizationModel[], audienceOrganizations?: CounterpartyResponseModel[], deliveryRegionName?: string }) {
    this.documentOrderNumber = conf.rfpData.documentOrderNumber;
    this.selectedOrganization = this._getSelectedOrganization(conf);
    this.dateLastUpdated = conf.rfpData.dateLastUpdated;
    this.datePlaced = conf.rfpData.datePlaced;
    this.dateCancelled = conf.rfpData.dateCancelled;
    this.audienceRestrictionType = this._getRestrictionTypeValue(conf.rfpData, this.restrictionTypeOptions);
    this.audienceParties = conf.audienceOrganizations;
    this.attachments = conf.rfpData.attachments;
    this.positions = conf.rfpData.proposalRequirements?.positions || null;
    this.dateCollectingFrom = conf.rfpData.proposalRequirements?.termsAndConditions?.dateCollectingFrom;
    this.dateCollectingTo = conf.rfpData.proposalRequirements?.termsAndConditions?.dateCollectingTo;
    this.dateConsideringTo = conf.rfpData.proposalRequirements?.termsAndConditions?.dateConsideringTo;
    if (conf.deliveryRegionName) {
      this.deliveryRegionName = conf.deliveryRegionName;
    }
    this.vatDeductible = conf.rfpData.proposalRequirements?.termsAndConditions?.vatDeductible;
    this.contactName = conf.rfpData.proposalRequirements?.contacts?.contactName;
    this.contactPhone = conf.rfpData.proposalRequirements?.contacts?.phone;
    this.contactEmail = conf.rfpData.proposalRequirements?.contacts?.email;
  }

  @Output() destroyModalChange: Subject<any> = new Subject();

  private _getSelectedOrganization(configuration) {
    let selectedOrganization = configuration.userOrganizations[0];
    if (configuration.rfpData?.proposalRequirements?.customerPartyId) {
      selectedOrganization = configuration.userOrganizations
        .find((org) => org.organizationId === configuration.rfpData.proposalRequirements.customerPartyId);
    }
    return selectedOrganization;
  }

  downloadFile(base64content: string, fileName?: string): void {
    const dataUrl = `data:${getBase64MimeType(base64content)};base64,${base64content}`
    if (fileName) {
      saveAs(dataUrl, fileName);
      return;
    }
    saveAs(dataUrl);
  }

  destroy(): void {
    this.destroyModalChange.next(true);
  }

  private _getRestrictionTypeValue(rfpData: RfpItemResponseModel, restrictionTypeOptions: { label: string, value: string }[]) {
    const restrictionType = rfpData.audience?.restrictionType;
    const isRestrictionTypeValid = this.restrictionTypeOptions.some((opt) => {
      return opt.value === restrictionType;
    });
    return isRestrictionTypeValid ? restrictionType : null;
  }

}
