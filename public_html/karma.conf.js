// Karma configuration
var webpackConfig = require('./webpack.config.js');
webpackConfig.entry = null;
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'src/**/*.js*',
      'test/**/*.js*'
    ],
    exclude: [
      'src/index.jsx',
      'src/index_dev.jsx'
    ],
    preprocessors: {
      'src/**/*.js*': ['webpack'],
      'test/**/*.js*': ['webpack']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    reporters: ['progress', 'verbose', 'coverage'],
    port: 9876,
    colors: true,
    autoWatch: false,
    browsers: ['FirefoxHeadless', 'Chrome'],
    customLaunchers: {
      FirefoxHeadless: {
        base: 'Firefox',
        flags: ['-headless']
      }
    },
    singleRun: true,
    concurrency: Infinity,
    client: {
      captureConsole: true
    },
    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m',
      terminal: true
    },
    logLevel: config.LOG_LOG
  })
}
