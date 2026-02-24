
const fs = require("fs");
const path = require("path");
const logsDir = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get("user-agent")
    };
    if (process.env.NODE_ENV === "development") {
      const statusColor = res.statusCode >= 400 ? "\x1b[31m" : "\x1b[32m";
      console.log(
        `${statusColor}${req.method}\x1b[0m ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
      );
    }
    const logFile = path.join(logsDir, `${new Date().toISOString().split("T")[0]}.log`);
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + "\n");
  });
  next();
};
const logEvent = (event, data = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    ...data
  };
  console.log(`📋 [${event}]`, data);
  const logFile = path.join(logsDir, "events.log");
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + "\n");
};
module.exports = {
  requestLogger,
  logEvent
};
