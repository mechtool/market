export class LocationModel {
  public fias?: string;
  public name?: string;
  public fullName?: string;
  public locality?: string;
  public street?: string;
  public house?: string;

  constructor(params) {
    Object.assign(this, params);
  }
}

export enum Level {
  CITY = 'city',
  STREET = 'street',
  HOUSE = 'house',
}

export enum CountryCode {
  RUSSIA = '643',
}

export class Megacity {
  public static ALL: LocationModel[] = [
    {
      fias: CountryCode.RUSSIA,
      name: 'Россия',
      fullName: 'Россия',
    },
    {
      fias: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
      name: 'Москва',
      fullName: 'Москва г',
    },
    {
      fias: 'c2deb16a-0330-4f05-821f-1d09c93331e6',
      name: 'Санкт-Петербург',
      fullName: 'Санкт-Петербург г',
    },
    {
      fias: '6fdecb78-893a-4e3f-a5ba-aa062459463b',
      name: 'Севастополь',
      fullName: 'Севастополь г',
    },
    {
      fias: '7dfa745e-aa19-4688-b121-b655c11e482f',
      name: 'Краснодар',
      fullName: 'Краснодар г, Краснодарский край',
    },
    {
      fias: '555e7d61-d9a7-4ba6-9770-6caa8198c483',
      name: 'Нижний Новгород',
      fullName: 'Нижний Новгород г, Нижегородская обл',
    },
    {
      fias: '2763c110-cb8b-416a-9dac-ad28a55b4402',
      name: 'Екатеринбург',
      fullName: 'Екатеринбург г, Свердловская обл',
    },
    {
      fias: 'a376e68d-724a-4472-be7c-891bdb09ae32',
      name: 'Челябинск',
      fullName: 'Челябинск г, Челябинская обл',
    },
    {
      fias: 'a309e4ce-2f36-4106-b1ca-53e0f48a6d95',
      name: 'Пермь',
      fullName: 'Пермь г, Пермский край',
    },
    {
      fias: '93b3df57-4c89-44df-ac42-96f05e9cd3b9',
      name: 'Казань',
      fullName: 'Казань г, Татарстан респ',
    },
    {
      fias: '8dea00e3-9aab-4d8e-887c-ef2aaa546456',
      name: 'Новосибирск',
      fullName: 'Новосибирск г, Новосибирская обл',
    },
  ];
}
