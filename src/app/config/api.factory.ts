import { UserService } from '#shared/modules/common-services';

export function ApiFactory(userService: UserService): () => Promise<any> {
  return (): Promise<any> => {
    return init(userService);
  };
}

function init(userService: UserService) {
  return new Promise((resolve, reject) => {
    return userService.updateUserCategories().subscribe(resolve, reject);
  });
}
