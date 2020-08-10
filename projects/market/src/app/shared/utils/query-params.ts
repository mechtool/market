import { Params } from '@angular/router';
import { AllGroupQueryFiltersModel } from '#shared/modules';

/**
 * API поиска продуктов требует, чтобы в запросе был указан хотябы один из параметр (q, categoryId, tradeMark, supplier)
 * @param queryParams url параметры запроса query string
 */
export function containParametersForRequest(queryParams: Params): boolean {
  return !!queryParams.q || !!queryParams.categoryId || !!queryParams.supplier || !!queryParams.trademark;
}

export function containParameters(queryParams: Params): boolean {
  return !!Object.keys(queryParams).length;
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

/**
 * Использовать где categoryId является частью url пути, а не query параметром
 */
export function queryParamsWithoutCategoryIdFrom(filters: AllGroupQueryFiltersModel): Params {
  return {
    q: filters.query,
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

/**
 * Использовать где supplierId является частью url пути, а не query параметром
 */
export function queryParamsWithoutSupplierIdFrom(filters: AllGroupQueryFiltersModel): Params {
  return {
    q: filters.query,
    categoryId: filters.availableFilters?.categoryId,
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
