export function getFlatPropertyArray(obj: any, prop: string = 'id'): any[] {
  const result = [];
  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      if (item[prop]) {
        result.push(item[prop]);
      }
      if (Array.isArray(item.children) && item.children.length) {
        result.push(...getFlatPropertyArray(item.children));
      }
    });
  } else {
    if (obj[prop]) {
      result.push(obj[prop]);
    }
    if (Array.isArray(obj.children) && obj.children.length) {
      result.push(...getFlatPropertyArray(obj.children));
    }
  }
  return result;
}
