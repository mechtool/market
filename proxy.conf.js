const PROXY_CONFIG = [
  {
    context: [
      '/proxifier',
    ],
    target: 'http://10.70.2.97:10820',
    // target: 'http://1cbn-api.dev.dept07/mynew',
    // target: 'https://bnet-api-stage.1c.ru/mynew',
    // target: 'https://api.1cbn.ru/mynew',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/proxifier': ''
    }
  }
]

module.exports = PROXY_CONFIG;
