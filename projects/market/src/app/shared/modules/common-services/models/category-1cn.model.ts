export class Category1cnModel {
  id: string;
  name: string;
  description: string;
  ancestors: {
    categoryId: string;
    categoryName: string
  }[];
  isLeaf: boolean;
}
