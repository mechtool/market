export function currencyCode(currencyNum: string): string {
  switch (currencyNum) {
    case '840':
      return OkvCode.OKV_USD_CODE;
    case '978':
      return OkvCode.OKV_EUR_CODE;
    case '826':
      return OkvCode.OKV_GBP_CODE;
    case '933':
      return OkvCode.OKV_BYN_CODE;
    case '398':
      return OkvCode.OKV_KZT_CODE;
    default:
      return OkvCode.DEFAULT_OKV_RUB_CODE;
  }
}

enum OkvCode {
  DEFAULT_OKV_RUB_CODE = 'RUB',
  OKV_USD_CODE = 'USD',
  OKV_EUR_CODE = 'EUR',
  OKV_GBP_CODE = 'GBP',
  OKV_BYN_CODE = 'BYN',
  OKV_KZT_CODE = 'KZT',
}
