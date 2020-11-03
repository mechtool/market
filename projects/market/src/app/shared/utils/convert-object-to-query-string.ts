export function convertObjectToQueryString(params: Object = {}): string {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    const queryParameter = params[key];

    if (Array.isArray(queryParameter)) {
      if (queryParameter !== undefined) {
        queryParameter.forEach((item) => {
          if (item !== undefined) {
            queryParams.append(key, item);
          }
        });
      }
    }

    if (!Array.isArray(queryParameter)) {
      if (queryParameter !== undefined) {
        queryParams.append(key, queryParameter);
      }
    }
  });
  return queryParams.toString() ? queryParams.toString() : '';
}
