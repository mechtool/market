export function getQueryStringWithoutParam(str: string, paramName: string): string {
  const objURL = {};
  str.replace(new RegExp('([^?=&]+)(=([^&]*))?', 'g'), ($0, $1, $2, $3) => {
    return (objURL[$1] = $3);
  });
  delete objURL[paramName];
  // tslint:disable-next-line:max-line-length prefer-template
  return Object.keys(objURL)
    .map((key) => key + '=' + objURL[key])
    .join('&')
    ? `?${Object.keys(objURL)
        .map((key) => key + '=' + objURL[key])
        .join('&')}`
    : '';
}
