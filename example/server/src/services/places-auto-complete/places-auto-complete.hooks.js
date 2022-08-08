// eslint-disable-next-line no-unused-vars
const {authenticate} = require('@feathersjs/authentication').hooks;
const winston = require('winston');
const {format, transports} = winston;
const path = require('path');

// eslint-disable-next-line no-unused-vars
const logFormat = format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`);

const logger = winston.createLogger({
  // transports: [<WinstonTransport>], // list of all winston transports instances to use.
  // format: [<logform.Format>], // formatting desired for log output.
  // winstonInstance: <WinstonLogger>, // a winston logger instance. If this is provided the transports and formats options are ignored.
  // level: String or function(req, res) { return String; }, // log level to use, the default is "info". Assign a  function to dynamically set the level based on request and response, or a string to statically set it always at that level. statusLevels must be false for this setting to be used.
  // msg: String or function, // customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}", "HTTP {{req.method}} {{req.url}}" or function(req, res) { return `${res.statusCode} - ${req.method}`.  Warning: while supported, returning mustache style interpolation from an options.msg function has performance and memory implications under load.
  // expressFormat: Boolean, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors when colorize set to true
  // colorize: Boolean, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  // meta: Boolean, // control whether you want to log the meta data about the request (default to true).
  // baseMeta: Object, // default meta data to be added to log, this will be merged with the meta data.
  // metaField: String, // if defined, the meta data will be added in this field instead of the meta root object. Defaults to 'meta'. Set to `null` to store metadata at the root of the log entry.
  // requestField: [String] // the property of the metadata to store the request under (default 'req'). Set to null to exclude request from metadata
  // statusLevels: Boolean or Object, // different HTTP status codes caused log messages to be logged at different levels (info/warn/error), the default is false. Use an object to control the levels various status codes are logged at. Using an object for statusLevels overrides any setting of options.level.
  // ignoreRoute: function (req, res) { return false; }, // A function to determine if logging is skipped, defaults to returning false. Called _before_ any later middleware.
  // skip: function(req, res) { return false; }, // A function to determine if logging is skipped, defaults to returning false. Called _after_ response has already been sent.
  // requestFilter: function (req, propName) { return req[propName]; }, // A function to filter/return request values, defaults to returning all values allowed by whitelist. If the function returns undefined, the key/value will not be included in the meta.
  // responseFilter: function (res, propName) { return res[propName]; }, // A function to filter/return response values, defaults to returning all values allowed by whitelist. If the function returns undefined, the key/value will not be included in the meta.
  // requestWhitelist: [String], // Array of request properties to log. Overrides global requestWhitelist for this instance
  // responseWhitelist: [String], // Array of response properties to log. Overrides global responseWhitelist for this instance
  // bodyWhitelist: [String], // Array of body properties to log. Overrides global bodyWhitelist for this instance
  // bodyBlacklist: [String], // Array of body properties to omit from logs. Overrides global bodyBlacklist for this instance
  // ignoredRoutes: [String], // Array of paths to ignore/skip logging. Overrides global ignoredRoutes for this instance
  // dynamicMeta: function(req, res) { return [Object]; } // Extract additional meta data from request or response (typically req.user data if using passport). meta must be true for this function to be activated
  // headerBlacklist: [String], // Array of headers to omit from logs. Applied after any previous filters.
  // level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.label({label: path.basename(process.mainModule.filename)}),
    format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    format.prettyPrint(),
    format.splat(),
    format.json(),
    // Format the metadata object
    format.metadata({fillExcept: ['message', 'level', 'timestamp', 'label', 'msg']})
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        format.prettyPrint(),
        format.colorize(),
        format.splat(),
        format.json(),
      )
    }),
    new transports.File({
      filename: 'logs/combined.log',
      format: format.combine()
    })
  ],
  exitOnError: false

});

const errorHook = context => {
  logger.log({
    level: 'error',
    message: context.error + ' ' + context.params.googleMaps
  });
  logger.log({
    level: 'error',
    message: context.error + ' ' + context.params.googleMaps
  });
};

// eslint-disable-next-line no-unused-vars
const successHook = context => {
  context.result.data = context.result.predictions;
  context.result.total = 0;
  context.result.limit = 400;
  context.result.skip = 0;
  logger.log({
    level: 'info',
    message: 'context.result.data: ' + context.result.data,
    msg: function (req, res) {
      return `${res.statusCode} - ${req.method}`;
    }
  });
  logger.log({
    level: 'info',
    message: 'context.params.googleMaps: ' + context.params.googleMaps
  });
  logger.log({
    level: 'info',
    message: 'context.result.predictions: ' + context.result.predictions
  });
};

// eslint-disable-next-line no-unused-vars
const preAPIHook = context => {
  logger.log({
    level: 'info',
    message: context.params.query + ' ' + context.params.query.input
  });
};

module.exports = {
  before: {
    all: [], //authenticate('jwt')
    find: [
      // preAPIHook
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      // preAPIHook,
      successHook
    ],
    get: [],
    create: [successHook],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [errorHook],
    get: [],
    create: [errorHook],
    update: [],
    patch: [],
    remove: []
  }
};
