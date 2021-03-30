export class BannersListResponseModel {
  _embedded: {
    items: BannerResponseModel[]
  };
}

export class BannerResponseModel {
  title: string;
  btnLink: string;
  btnQueryParams: {
    [key: string]: any;
  };
  btnText: string;
  description: string;
  imgUrl: string;
}
