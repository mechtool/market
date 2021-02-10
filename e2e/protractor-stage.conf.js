const defaultConfig = require('./protractor.conf');
let devConfig = {
  params: {
    production: false,
    credentials: {
      userLogin: 'testUser704',
      userPassword: 'doNotChangePassword!'
    },
    defaultTimeout: 1e4,
    defaultSupplierNamePart: 'метро',
  }
};
exports.config = Object.assign(defaultConfig.config, devConfig);
