const { createLogger, format, transports, config } = require("winston");

const loggerFactory = function (meta) {
  const logger = createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: format.json(),
    transports: [new transports.Console()],
  });
  logger.defaultMeta = meta;
  return logger;
};

const logger = loggerFactory({});

module.exports = logger;
