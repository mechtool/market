export function getPropValueByPath(path: string, obj: any): any {
  return path.split('.').reduce((p, c) => (p && p.hasOwnProperty(c) ? p[c] : null), obj);
}
