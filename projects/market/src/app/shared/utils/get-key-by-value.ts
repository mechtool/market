export function getKeyByValue(object: any, value: any): string {
  return Object.keys(object).find((key) => object[key] === value);
}
