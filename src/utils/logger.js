// utils/logger.js
import pino from 'pino';
import pretty from 'pino-pretty';

let logBuffer = [];

const prettyStream = pretty({
  colorize: true,
  translateTime: 'SYS:standard'
});
prettyStream.pipe(process.stdout);

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

export function getTestLogger(testTitle, suiteTitle) {
  return logger.child({ test: testTitle, suite: suiteTitle });
}

export default logger;
export { logger };
