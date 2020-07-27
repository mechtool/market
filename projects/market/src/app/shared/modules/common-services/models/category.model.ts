export class CategoryModel {
  id: string;
  name: string;
  isLeaf: boolean;
  products: number;
  offers: number;
  parentId?: string; // TODO: убрать когда будут заменены getCategoryTree2 и getCategoriesChildren2
  children?: CategoryModel[];
  visible?: boolean;
  disabled?: boolean;
}
