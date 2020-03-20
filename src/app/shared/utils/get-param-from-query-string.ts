export function getParamFromQueryString(queryString: string): string {
  const parseQueryString: Function = () => {
    const str = location.search;
    const objURL = {};
    str.replace(
        new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
        ($0, $1, $2, $3) => {
          return objURL[$1] = $3;
        },
    );
    return objURL;
  };
  return parseQueryString()[queryString];
}