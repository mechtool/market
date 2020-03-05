export function concatUrlQueryParamsObject(url: string,  queryParamsObject: Object) {
  const queryParams = new URLSearchParams();
  Object.keys(queryParamsObject).forEach((key) => {
    if (Array.isArray(queryParamsObject[key])) {
      queryParamsObject[key].forEach((item) => {
        queryParams.append(key, item);
      });
    }
    if (!Array.isArray(queryParamsObject[key])) {
      queryParams.append(key, queryParamsObject[key]);
    }
  });
  return `${url}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
}
