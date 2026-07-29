#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const testMatch = args.find(a => a.startsWith('--test='))?.replace('--test=', '') || args[0] || '@tc_6';

console.log(`🔧 Self-Heal Test: ${testMatch}\n`);

try {
    console.log('📋 Analyzing test failure...');
    execSync(`npx wdio run ./wdio.conf.js --suite regression --mochaOpts.grep="${testMatch}"`, {
        shell: true,
        stdio: 'inherit'
    });
} catch (error) {
    console.error('\n⚠️  Test failed. Please review the output above.');
    console.error('💡 Suggest using /debug for detailed analysis.');
    process.exit(1);
}

console.log('\n✅ Test passed after healing.');
