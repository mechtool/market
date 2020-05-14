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
