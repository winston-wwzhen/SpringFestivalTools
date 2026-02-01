// utils/logger.js - 简单的日志工具
const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, 'app.log');

function formatMessage(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}\n`;
}

function writeToFile(message) {
  fs.appendFileSync(logFile, message, 'utf8');
}

const logger = {
  info(message, meta) {
    const msg = formatMessage('info', message, meta);
    console.log(msg.trim());
    writeToFile(msg);
  },

  error(message, meta) {
    const msg = formatMessage('error', message, meta);
    console.error(msg.trim());
    writeToFile(msg);
  },

  warn(message, meta) {
    const msg = formatMessage('warn', message, meta);
    console.warn(msg.trim());
    writeToFile(msg);
  },

  debug(message, meta) {
    const msg = formatMessage('debug', message, meta);
    if (process.env.LOG_LEVEL === 'debug') {
      console.log(msg.trim());
      writeToFile(msg);
    }
  }
};

module.exports = logger;
