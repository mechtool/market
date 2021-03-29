export class ProductsHighlightListResponseModel {
  _embedded: {
    items: ProductsHighlightResponseModel[]
  };
}

export class ProductsHighlightResponseModel {
  title: string;
  url: string;
  img: string;
  queryParams: any;
  items: ProductsHighlightItems[];
}

class ProductsHighlightItems {
  title: string;
  url: string;
  queryParams: any;
}
