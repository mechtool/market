export class LocationModel {

  public fias?: string;
  public name?: string;
  public fullName?: string;
  public areaId?: string;
  public countryId?: number;
  public countryCode?: string;

  constructor(params) {
    Object.assign(this, params);
  }

}

