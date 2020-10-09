export function getFlatObjectArray(obj: any, prop: string = 'id'): any[] {
  const result = [];
  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      if (item[prop]) {
        result.push(item);
      }
      if (Array.isArray(item.children) && item.children.length) {
        result.push(...getFlatObjectArray(item.children));
      }
    });
  } else {
    if (obj[prop]) {
      result.push(obj);
    }
    if (Array.isArray(obj.children) && obj.children.length) {
      result.push(...getFlatObjectArray(obj.children));
    }
  }
  return result;
}
