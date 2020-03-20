export function generateQueryStringFromObject( queryParamsObject: Object): string {
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
  return queryParams.toString() ? queryParams.toString() : '';
}
