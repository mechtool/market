import { Params } from '@angular/router';
import { AllGroupQueryFiltersModel } from '#shared/modules';

export function hasRequiredParameters(groupQuery: AllGroupQueryFiltersModel): boolean {
  return !!groupQuery.query || !!groupQuery.filters?.supplierId || !!groupQuery.filters?.categoryId || !!groupQuery.filters?.tradeMark;
}


export function queryParamsForProductsFrom(groupQuery: AllGroupQueryFiltersModel): Params {
  return {
    ...(groupQuery.query?.length > 2 && { q: groupQuery.query }),
    ...(groupQuery.filters?.supplierId && { supplierId: groupQuery.filters?.supplierId }),
    ...(groupQuery.filters?.tradeMark && { tradeMark: groupQuery.filters?.tradeMark }),
    ...(!groupQuery.filters?.isDelivery && { isDelivery: 'false' }),
    ...(!groupQuery.filters?.isPickup && { isPickup: 'false' }),
    ...(groupQuery.filters?.inStock && { inStock: 'true' }),
    ...(groupQuery.filters?.withImages && { withImages: 'true' }),
    ...(groupQuery.filters?.hasDiscount && { hasDiscount: 'true' }),
    ...(groupQuery.filters?.features?.length && { features: groupQuery.filters.features }),
    ...(groupQuery.filters?.priceFrom && { priceFrom: groupQuery.filters.priceFrom }),
    ...(groupQuery.filters?.priceTo && { priceTo: groupQuery.filters.priceTo }),
    ...(groupQuery.filters?.subCategoryId && { subCategoryId: groupQuery.filters?.subCategoryId }),
  };
}

export function queryParamsForSupplierShopFrom(groupQuery: AllGroupQueryFiltersModel): Params {
  return {
    ...(groupQuery.query?.length > 2 && { q: groupQuery.query }),
    ...(groupQuery.filters?.tradeMark && { tradeMark: groupQuery.filters?.tradeMark }),
    ...(!groupQuery.filters?.isDelivery && { isDelivery: 'false' }),
    ...(!groupQuery.filters?.isPickup && { isPickup: 'false' }),
    ...(groupQuery.filters?.inStock && { inStock: 'true' }),
    ...(groupQuery.filters?.withImages && { withImages: 'true' }),
    ...(groupQuery.filters?.hasDiscount && { hasDiscount: 'true' }),
    ...(groupQuery.filters?.priceFrom && { priceFrom: groupQuery.filters.priceFrom }),
    ...(groupQuery.filters?.priceTo && { priceTo: groupQuery.filters.priceTo }),
    ...(groupQuery.filters?.subCategoryId && { subCategoryId: groupQuery.filters?.subCategoryId }),
  };
}

/*export function queryParamsFrom(groupQuery: AllGroupQueryFiltersModel): Params {
  const hasRequiredParams = hasRequiredRequestParams(groupQuery);
  return {
    q: groupQuery.query,
    categoryId: groupQuery.filters?.categoryId,
    supplierId: groupQuery.filters?.supplierId,
    tradeMark: groupQuery.filters?.tradeMark,
    isDelivery: hasRequiredParams ? groupQuery.filters?.isDelivery : undefined,
    isPickup: hasRequiredParams ? groupQuery.filters?.isPickup : undefined,
    inStock: groupQuery.filters?.inStock,
    withImages: groupQuery.filters?.withImages,
    priceFrom: groupQuery.filters?.priceFrom,
    priceTo: groupQuery.filters?.priceTo,
    sort: groupQuery.sort,
    page: groupQuery.page,
  };
}*/

/**
 * Использовать где categoryId является частью url пути, а не query параметром
 */
/*export function queryParamsWithoutCategoryIdFrom(groupQuery: AllGroupQueryFiltersModel): Params {
  const hasRequiredParams = hasRequiredRequestParams(groupQuery);
  return {
    q: groupQuery.query,
    supplierId: groupQuery.filters?.supplierId,
    tradeMark: groupQuery.filters?.tradeMark,
    isDelivery: hasRequiredParams ? groupQuery.filters?.isDelivery : undefined,
    isPickup: hasRequiredParams ? groupQuery.filters?.isPickup : undefined,
    inStock: groupQuery.filters?.inStock,
    withImages: groupQuery.filters?.withImages,
    priceFrom: groupQuery.filters?.priceFrom,
    priceTo: groupQuery.filters?.priceTo,
    sort: groupQuery.sort,
    page: groupQuery.page,
  };
}*/

/**
 * Использовать где supplierId является частью url пути, а не query параметром
 */
export function queryParamsWithoutSupplierIdFrom(groupQuery: AllGroupQueryFiltersModel): Params {
  const hasRequiredParams = hasRequiredRequestParams(groupQuery);
  return {
    q: groupQuery.query ? groupQuery.query : undefined,
    subCategoryId: groupQuery.filters?.subCategoryId,
    tradeMark: groupQuery.filters?.tradeMark,
    isDelivery: hasRequiredParams ? groupQuery.filters?.isDelivery : undefined,
    isPickup: hasRequiredParams ? groupQuery.filters?.isPickup : undefined,
    inStock: groupQuery.filters?.inStock,
    withImages: groupQuery.filters?.withImages,
    priceFrom: groupQuery.filters?.priceFrom,
    priceTo: groupQuery.filters?.priceTo,
    sort: groupQuery.sort,
    page: groupQuery.page,
  };
}

/**
 * Добавление queryParams в url
 */
export function addURLParameters(url: string, params: Map<string, any>) {
  params.forEach((value, key) => {
    const hasQueryParams = url.includes('?');
    url = `${url}${hasQueryParams ? '&' : '?'}${key}=${value}`;
  });
  return url;
}

/**
 * Изменение queryParams в url
 */
export function updateUrlParameters(url: string, params: Map<string, any>) {
  params.forEach((value, key) => {
    const regex = new RegExp(`(${key}=)[^&]+`);
    url = url.replace(regex, `$1${value}`);
  })
  return url;
}

/**
 * Удаление queryParams в url
 */
export function removeURLParameters(url, ...params) {
  const urlParts = url.split('?');
  if (urlParts.length >= 2) {
    const pars = urlParts[1].split(/[&;]/g);

    for (let i = 0; i < params.length; i++) {
      const prefix = `${encodeURIComponent(params[i])}=`;

      for (let j = pars.length; j-- > 0;) {
        if (pars[j].lastIndexOf(prefix, 0) !== -1) {
          pars.splice(j, 1);
        }
      }
    }
    return urlParts[0] + (pars.length > 0 ? `?${pars.join('&')}` : '');
  }
  return url;
}

function hasRequiredRequestParams(groupQuery: AllGroupQueryFiltersModel): boolean {
  return !!groupQuery.query || !!groupQuery.filters?.categoryId || !!groupQuery.filters?.tradeMark || !!groupQuery.filters?.supplierId;
}
