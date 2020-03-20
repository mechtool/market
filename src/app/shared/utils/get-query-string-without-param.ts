export function getQueryStringWithoutParam(paramName: string): string {
  const str = location.search;
  const objURL = {};
  str.replace(
    new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
    ($0, $1, $2, $3) => {
      return objURL[$1] = $3;
    },
  );
  delete objURL[paramName];
  // tslint:disable-next-line: max-line-length
  return Object.keys(objURL).map(key => key + '=' + objURL[key]).join('&') ? `?${Object.keys(objURL).map(key => key + '=' + objURL[key]).join('&')}` : '';
}