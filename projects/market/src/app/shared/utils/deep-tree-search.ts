export function deepTreeSearch(object: any, key: string, predicate: (x: any, y: any) => boolean) {
  if (object?.hasOwnProperty(key) && predicate(key, object[key]) === true) {
    return object;
  }

  if (object) {
    for (let i = 0; i < Object.keys(object).length; i++) {
      if (
        typeof object[Object.keys(object)[i]] === 'object' &&
        object[Object.keys(object)[i]] !== null
      ) {
        const o = deepTreeSearch(object[Object.keys(object)[i]], key, predicate);
        if (o != null) {
          return o;
        }
      }
    }
  }

  return null;
}
