import { PageModel } from './page.model';

export class RfpListResponseModel {
  page: PageModel;
  _embedded: {
    items: RfpListResponseItemModel[]
  };
}

export class RfpListResponseItemModel {
  documentOrderNumber: string;
  audience: {
    parties: {
      inn: string;
      kpp: string;
    }[];
    restrictionType: string;
  };
  proposalRequirements: {
    positions: {
      positionCorrelationId: string;
      product: {
        customerSpecification?: {
          ref1CnCategory: {
            categoryId: string;
            manufacturerId: string;
            tradeMarkId: string;
            requisiteValues: {
              id: string;
              value: string;
            }[];
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
    }[];
    termsAndConditions: {
      isPartialPurchaseAcceptable: boolean;
      isCommissionTransaction: boolean
      deliveryRegion: {
        countryCode: string;
        fiasRegionCode: string;
      };
      vatDeductible: boolean;
      currencyCode: string;
      dateCollectingFrom: string;
      dateCollectingTo: string;
      dateConsideringTo: string;
      paymentDescription: string;
      deliveryDescription: string;
      description: string;
    };
    contacts: {
      contactName:	string;
      phone:	string;
      email:	string;
    };
    customerPartyId: string;
  };
  id: string;
  datePlaced: string;
  dateLastUpdated: string;
  dateCancelled: string;
}
