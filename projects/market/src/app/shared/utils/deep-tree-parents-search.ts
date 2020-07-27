export function deepTreeParentsSearch(object: any, key: string, keyValue: string) {
  if (object[key] === keyValue) {
    return [];
  }

  if (Array.isArray(object.children || object)) {
    for (const treeNode of object.children || object) {

      const childResult = deepTreeParentsSearch(treeNode, 'id', keyValue);

      if (Array.isArray(childResult)) {
        return [treeNode].concat(childResult);
      }
    }
  }
}
