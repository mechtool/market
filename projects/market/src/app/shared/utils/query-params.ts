import { Params } from '@angular/router';
import { AllGroupQueryFiltersModel } from '#shared/modules';

export function containParameters(queryParams: Params): boolean {
  return !!Object.keys(queryParams).length;
}

export function queryParamsFrom(groupQuery: AllGroupQueryFiltersModel): Params {
  const hasRequiredParams = hasRequiredRequestParams(groupQuery);
  return {
    q: groupQuery.query,
    categoryId: groupQuery.filters?.categoryId,
    supplierId: groupQuery.filters?.supplierId,
    trademark: groupQuery.filters?.trademark,
    isDelivery: hasRequiredParams ? groupQuery.filters?.isDelivery : undefined,
    isPickup: hasRequiredParams ? groupQuery.filters?.isPickup : undefined,
    inStock: groupQuery.filters?.inStock,
    withImages: groupQuery.filters?.withImages,
    priceFrom: groupQuery.filters?.priceFrom,
    priceTo: groupQuery.filters?.priceTo,
    sort: groupQuery.sort,
  };
}

/**
 * Использовать где categoryId является частью url пути, а не query параметром
 */
export function queryParamsWithoutCategoryIdFrom(groupQuery: AllGroupQueryFiltersModel): Params {
  const hasRequiredParams = hasRequiredRequestParams(groupQuery);
  return {
    q: groupQuery.query,
    supplierId: groupQuery.filters?.supplierId,
    trademark: groupQuery.filters?.trademark,
    isDelivery: hasRequiredParams ? groupQuery.filters?.isDelivery : undefined,
    isPickup: hasRequiredParams ? groupQuery.filters?.isPickup : undefined,
    inStock: groupQuery.filters?.inStock,
    withImages: groupQuery.filters?.withImages,
    priceFrom: groupQuery.filters?.priceFrom,
    priceTo: groupQuery.filters?.priceTo,
    sort: groupQuery.sort,
  };
}

/**
 * Использовать где supplierId является частью url пути, а не query параметром
 */
export function queryParamsWithoutSupplierIdFrom(groupQuery: AllGroupQueryFiltersModel): Params {
  const hasRequiredParams = hasRequiredRequestParams(groupQuery);
  return {
    q: groupQuery.query,
    categoryId: groupQuery.filters?.categoryId,
    trademark: groupQuery.filters?.trademark,
    isDelivery: hasRequiredParams ? groupQuery.filters?.isDelivery : undefined,
    isPickup: hasRequiredParams ? groupQuery.filters?.isPickup : undefined,
    inStock: groupQuery.filters?.inStock,
    withImages: groupQuery.filters?.withImages,
    priceFrom: groupQuery.filters?.priceFrom,
    priceTo: groupQuery.filters?.priceTo,
    sort: groupQuery.sort,
  };
}

function hasRequiredRequestParams(groupQuery: AllGroupQueryFiltersModel): boolean {
  return !!groupQuery.query || !!groupQuery.filters?.categoryId || !!groupQuery.filters?.trademark || !!groupQuery.filters?.supplierId;
}
