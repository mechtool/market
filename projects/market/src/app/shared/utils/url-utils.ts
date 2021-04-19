// tslint:disable-next-line:max-line-length
export const URL_RE = new RegExp('^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?');

export function removeLastSlash(url: string) {
  if (url.lastIndexOf('/') === (url.length - 1)) {
    return url.slice(0, -1);
  }
  return url;
}
