import pino from 'pino';
import pretty from 'pino-pretty';

let logBuffer = [];

/**
 * Extracts the calling function name from the current stack trace.
 * @returns {string} Caller function name or 'unknown'.
 */
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

/**
 * Pino logger instance configured for console and in-memory buffering.
 * @type {import('pino').Logger}
 */
const logger = pino(
  { level: process.env.LOG_LEVEL || 'info' },
  pino.multistream([
    { stream: prettyStream },
    { stream: captureStream }
  ])
);

/**
 * Returns a shallow copy of the current in-memory log buffer.
 * @returns {string[]} Array of formatted log strings.
 */
export function getLogBuffer() {
  return logBuffer.slice();
}

/**
 * Clears the in-memory log buffer.
 */
export function clearLogBuffer() {
  logBuffer = [];
}

/**
 * Creates a child logger bound to a specific test and suite.
 * @param {string} testTitle - Title of the current test.
 * @param {string} suiteTitle - Title of the current suite.
 * @returns {import('pino').Logger} Child logger instance.
 */
export function getTestLogger(testTitle, suiteTitle) {
  return logger;
}

export default logger;
export { logger };
