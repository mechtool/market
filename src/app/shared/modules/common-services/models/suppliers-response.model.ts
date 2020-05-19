import { PageModel } from './page.model';
import { SuppliersItemModel } from '#shared/modules/common-services/models/suppliers-item.model';

export class SuppliersResponseModel {
  page: PageModel;
  _embedded: {
    suppliers: SuppliersItemModel[];
  };
}
