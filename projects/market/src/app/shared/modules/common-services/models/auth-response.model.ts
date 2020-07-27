import { UserInfoModel } from './user-info.model';

export class AuthResponseModel {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiration: number;
  refreshTokenExpiration: number;
  userInfo: UserInfoModel;

  constructor(params) {
    Object.assign(this, params);
  }
}
