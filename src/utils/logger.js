// utils/logger.js
import pino from 'pino';
import pretty from 'pino-pretty';

let logBuffer = [];

function getCallerFunctionName() {
    const stack = new Error().stack;
    if (!stack) return 'unknown';
    const lines = stack.split('\n');
    for (const line of lines) {
        const match = line.match(/at\s+(\S+)\s*\(/);
        if (match) {
            const fnName = match[1];
            if (fnName === 'getCallerFunctionName') continue;
            if (fnName === 'write') continue;
            if (fnName.includes('captureStream')) continue;
            if (fnName.includes('pino')) continue;
            if (fnName.includes('multistream')) continue;
            if (fnName.includes('Logger')) continue;
            const parts = fnName.split('.');
            const baseName = parts[parts.length - 1];
            if (baseName && baseName !== 'write' && baseName !== 'getCallerFunctionName') {
                return baseName;
            }
        }
    }
    return 'unknown';
}

const prettyStream = pretty({
  colorize: true,
  translateTime: 'SYS:standard',
  ignore: 'pid,hostname,level,time'
});
prettyStream.pipe(process.stdout);

const captureStream = {
  write(chunk) {
    try {
      const entry = JSON.parse(chunk);
      const levelLabel = pino.levels.labels[entry.level] || 'info';
      const fnName = getCallerFunctionName();
      logBuffer.push(`[${levelLabel.toUpperCase()}] [${fnName}] ${entry.msg}`);
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
