import { NomenclatureModel } from './nomenclature.model';
import { MetaModel } from './meta.model';

export class NomenclaturesListResponseModel {
  page: PageModel;
  _embedded: {
    items: NomenclatureModel[];
  };
  _meta: MetaModel;
}

export class PageModel {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}


