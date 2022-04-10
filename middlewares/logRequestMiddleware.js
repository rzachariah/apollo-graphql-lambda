const perfNow = require("performance-now");
const { logger } = require("../logger");

const logRequestMiddleware = function (req, res, next) {
  // Don't log health checks
  if (req.originalUrl.toLowerCase() === "/health") {
    next();
    return;
  }

  const startTime = perfNow();
  const logContext = {
    originalUrl: req.originalUrl.toLowerCase(),
  };
  logger.info("Start Request", logContext);

  // Response.end is the last method called before putting the bytes on the wire
  const originalReqEnd = res.end;
  res.end = function (...args) {
    const endTime = perfNow();
    logContext.executionTimeInMilliseconds = endTime - startTime;
    logContext.statusCode = res.statusCode;
    logger.info("End Request", logContext);
    originalReqEnd.apply(res, args);
  };
  next();
};

exports.logRequestMiddleware = logRequestMiddleware;
