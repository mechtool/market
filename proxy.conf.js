const PROXY_CONFIG = [
  {
    context: [
      '/proxifier',
    ],
    target: 'http://10.70.2.97:10810',
    // target: 'http://1cbn-api.dev.dept07/dashboard',
    // target: 'https://bnet-api-stage.1c.ru/dashboard',
    // target: 'https://api.1cbn.ru/dashboard',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/proxifier': ''
    }
  }
]

module.exports = PROXY_CONFIG;
