import differenceInDays from 'date-fns/differenceInDays';
import { RfpListResponseItemModel } from '#shared/modules/common-services/models/rfp-list-reponse.model';

export class RfpListItemModel {
  customerId: string;
  customerName: string;
  customerInn: string;
  id: string;
  documentOrderNumber: string;
  datePlaced: string;
  dateCancelled: string;
  dateLastUpdated: string;
  productNames: string[];
  status: string;
  statusDate: Date;

  constructor(item: RfpListResponseItemModel) {
    this.customerId = item.proposalRequirements.customerPartyId;
    this.id = item.id;
    this.documentOrderNumber = item.documentOrderNumber;
    this.datePlaced = item.datePlaced;
    this.dateCancelled = item.dateCancelled;
    this.dateLastUpdated = item.dateLastUpdated;
    this.productNames = item.proposalRequirements.positions.map((pos) => pos.product.customerSpecification.productName);
    const { status, statusDate } = this._setStatusInfo(
      item.proposalRequirements.termsAndConditions.dateCollectingFrom, item.proposalRequirements.termsAndConditions.dateCollectingTo,
      item.proposalRequirements.termsAndConditions.dateConsideringTo, item.dateCancelled
    );
    this.status = status;
    this.statusDate = statusDate;
  }

  setCustomerName(customerName: string) {
    this.customerName = customerName;
    return this;
  }

  setCustomerInn(customerInn: string) {
    this.customerInn = customerInn;
    return this;
  }

  private _setStatusInfo(dateCollectingFrom, dateCollectingTo, dateConsideringTo, dateCancelled): { status: any, statusDate: Date} {
    const now = new Date();
    const collectingFrom = new Date(dateCollectingFrom);
    const collectingTo = new Date(dateCollectingTo);
    const consideringTo = new Date(dateConsideringTo);
    const cancelled = dateCancelled ? new Date(dateCancelled) : null;

    let status;
    let statusDate;

    if (cancelled) {
      status = 'CANCELLED';
      statusDate = cancelled;
    } else if (differenceInDays(now, consideringTo) >= 0) {
      status = 'COMPLETED';
      statusDate = consideringTo;
    } else if (differenceInDays(now, collectingTo) >= 0) {
      status = 'ANALYSIS';
      statusDate = consideringTo;
    } else if (differenceInDays(now, collectingFrom) >= 0) {
      status = 'COLLECTING';
      statusDate = collectingTo;
    } else {
      status = 'PREPARATION';
      statusDate = collectingFrom
    }

    return { status, statusDate };

  }

}
