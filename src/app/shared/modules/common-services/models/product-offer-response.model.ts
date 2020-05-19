import { NomenclatureModel } from './nomenclature.model';
import { OffersModel } from './offers.model';

export class ProductOfferResponseModel {
  nomenclature: NomenclatureModel;
  offers: OffersModel[];
}
