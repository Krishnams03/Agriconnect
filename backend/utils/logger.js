const { createLogger, format, transports } = require("winston");
const config = require("../config");

const logger = createLogger({
  level: config.logLevel,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.printf(({ level, message, timestamp, stack, ...meta }) => {
      const base = `${timestamp} [${level.toUpperCase()}] ${message}`;
      if (stack) {
        return `${base}\n${stack}`;
      }
      const metaKeys = Object.keys(meta);
      return metaKeys.length ? `${base} ${JSON.stringify(meta)}` : base;
    })
  ),
  transports: [new transports.Console()],
});

module.exports = logger;
