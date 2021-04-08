export class PagesStaticListResponseModel {
  _embedded: {
    items: PageStaticResponseModel[]
  };
}

export class PageStaticResponseModel {
  id: number;
  pageId: string;
  title: string;
  content: string;
  lastModified: string;
}
