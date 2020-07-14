import { Params } from '@angular/router';
import { AllGroupQueryFiltersModel } from '#shared/modules';

/**
 * API поиска продуктов требует, чтобы в запросе был указан хотябы один из параметр (q, categoryId, tradeMark, supplier)
 * @param queryParams url параметры запроса query string
 */
export function containParametersForRequest(queryParams: Params): boolean {
  return !!queryParams.q || !!queryParams.categoryId || !!queryParams.supplier || !!queryParams.trademark;
}

export function queryParamsFrom(filters: AllGroupQueryFiltersModel): Params {
  return {
    q: filters.query,
    categoryId: filters.availableFilters?.categoryId,
    supplierId: filters.availableFilters?.supplierId,
    trademark: filters.availableFilters?.trademark,
    delivery: filters.availableFilters?.delivery,
    pickup: filters.availableFilters?.pickup,
    inStock: filters.availableFilters?.inStock,
    withImages: filters.availableFilters?.withImages,
    priceFrom: filters.availableFilters?.priceFrom,
    priceTo: filters.availableFilters?.priceTo,
    sort: filters.sort,
  };
}
