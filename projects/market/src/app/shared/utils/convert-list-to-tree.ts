export function convertListToTree(list: any[]) {
  const map = {};
  let node: { parentId: string | number };
  const roots = [];
  let i: number;

  for (i = 0; i < list.length; i += 1) {
    map[list[i].id] = i;
    list[i].children = [];
  }
  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node.parentId !== null) {
      list[map[node.parentId]].children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export function convertCategoryListToTree(categories: any[]) {
  const map = {};
  const roots = [];
  const newCategories = [];

  for (let i = 0; i < categories.length; i++) {
    map[categories[i].id] = i;
    newCategories[i] = {
      key: categories[i].id,
      title: categories[i].name,
      selectable: categories[i].isLeaf,
      isLeaf: categories[i].isLeaf,
      children: []
    };
  }

  for (let i = 0; i < categories.length; i++) {
    const node = categories[i];

    if (node?.ancestors?.length) {
      newCategories[map[node?.ancestors[0].categoryId]].children.push(newCategories[i]);
    } else {
      roots.push(newCategories[i]);
    }
  }
  return roots.sort((one, two) => one.isLeaf - two.isLeaf);
}

export function newTreeData(data: any[]): any[] {
  const _filter = (node: any, result: any[]) => {
    if (node.isLeaf) {
      result.push({ ...node });
      return result;
    }
    if (Array.isArray(node.children)) {
      const nodes = node.children.reduce((a, b) => _filter(b, a), []);
      if (nodes.length) {
        const parentNode = { ...node, children: nodes };
        result.push(parentNode);
      }
    }
    return result;
  };
  return data.reduce((a, b) => _filter(b, a), []);
}
