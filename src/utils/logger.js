// utils/logger.js
import pino from 'pino';
import pretty from 'pino-pretty';

// Buffer to hold log lines for the currently running test
let logBuffer = [];

// Pretty stream for console output (colorized, as before)
const prettyStream = pretty({
  colorize: true,
  translateTime: 'SYS:standard'
});
prettyStream.pipe(process.stdout);

// Custom stream that captures each log line for report attachment
const captureStream = {
  write(chunk) {
    try {
      const entry = JSON.parse(chunk);
      const levelLabel = pino.levels.labels[entry.level] || 'info';
      logBuffer.push(`[${levelLabel.toUpperCase()}] ${entry.msg}`);
    } catch {
      logBuffer.push(chunk.toString().trim());
    }
  }
};

const logger = pino(
  { level: process.env.LOG_LEVEL || 'info' },
  pino.multistream([
    { stream: prettyStream },
    { stream: captureStream }
  ])
);

export function getLogBuffer() {
  return logBuffer.slice();
}

export function clearLogBuffer() {
  logBuffer = [];
}

export default logger;
export { logger };