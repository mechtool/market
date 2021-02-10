const defaultConfig = require('./protractor.conf');
let devConfig = {
  params: {
    production: true,
    credentials: {
      userLogin: 'bn-client-edo-user',
      userPassword: '123Qwerty'
    },
    defaultTimeout: 1e4,
    defaultSupplierNamePart: 'Седов',
  },
};
exports.config = Object.assign(defaultConfig.config, devConfig);
