import { NomenclatureModel } from './nomenclature.model';

export class NomenclaturesListResponseModel {
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
  _embedded: {
    items: NomenclatureModel[];
  };
  _meta: any; // TODO
}


