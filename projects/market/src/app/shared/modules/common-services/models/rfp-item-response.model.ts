export class RfpItemResponseAudiencePartyModel {
  inn: string;
  kpp: string;
}

export class RfpItemResponseAttachmentModel {
  name: string;
  title: string;
  content: string;
}

export class RfpItemResponsePositionRef1CnCategoryRequisiteModel {
  id: string;
  value: string;
}

export class RfpItemResponsePositionModel {
  positionCorrelationId: string;
  product: {
    customerSpecification?: {
      ref1CnCategory: {
        categoryId: string;
        manufacturerId: string;
        tradeMarkId: string;
        requisiteValues: RfpItemResponsePositionRef1CnCategoryRequisiteModel[];
      };
      productName: string;
      productDescription: string;
      manufacturer: {
        tradeMark: string;
        name: string;
      };
      partNumber: string;
      baseUnitOkeiCode: string;
      barCodes: string[];
      requisiteValues: {
        name: string;
        value: string;
      }[];
    };
  };
  additionalProductDescription: {
    title: string;
    description: string;
  };
  purchaseConditions: {
    packaging: {
      description: string;
      unitsNumerator: number;
      unitsDenominator: number;
    };
    maxPrice: number;
    numberOfPackages: number;
    maxDaysForDelivery: number
    dateDesiredDeliveryTo: string;
  };
}

export class RfpItemResponseModel {
  documentOrderNumber?: string;
  audience?: {
    parties?: RfpItemResponseAudiencePartyModel[];
    restrictionType?: string;
  };
  proposalRequirements: {
    positions: RfpItemResponsePositionModel[];
    termsAndConditions: {
      deliveryRegion?: {
        countryCode?: string;
        fiasRegionCode?: string;
      };
      vatDeductible: boolean;
      currencyCode: string;
      dateCollectingFrom: string;
      dateCollectingTo: string;
      dateConsideringTo: string;
    };
    contacts: {
      contactName?:	string;
      phone: string;
      email: string;
    };
    customerPartyId: string;
  };
  id?: string;
  datePlaced?: string;
  dateLastUpdated?: string;
  dateCancelled?: string;
  attachments?: RfpItemResponseAttachmentModel[];
}
