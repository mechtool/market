const PROXY_CONFIG = [
  {
    context: [
      '/proxifier',
    ],
    target: 'http://10.70.2.97:10820',
    // target: 'http://1cbn-api.dev.dept07/client',
    // target: 'https://bnet-api-stage.1c.ru/client',
    // target: 'https://api.1cbn.ru/client',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/proxifier': ''
    }
  }
]

module.exports = PROXY_CONFIG;
