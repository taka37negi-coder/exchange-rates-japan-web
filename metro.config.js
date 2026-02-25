const { getDefaultConfig } = require('expo/metro-config' );

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  publicPath: '/exchange-rates-japan-web/_expo/static',
};

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      if (req.url.startsWith('/_expo/static')) {
        req.url = '/exchange-rates-japan-web' + req.url;
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
