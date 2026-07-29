export const logger = {
  info(message) {
    console.log(`[INFO] ${message}`);
  },
  step(message) {
    console.log(`[STEP] ${message}`);
  },
  pass(message) {
    console.log(`[PASS] ${message}`);
  },
  fail(message) {
    console.error(`[FAIL] ${message}`);
  },
  debug(message) {
    console.log(`[DEBUG] ${message}`);
  }
};
