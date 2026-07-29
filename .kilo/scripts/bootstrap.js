#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Agentic Bootstrap - Kilo QA Environment Validation\n');

const checks = [
    { name: 'Node.js', cmd: 'node --version' },
    { name: 'WDIO CLI', cmd: 'npx wdio --version' },
    { name: 'WDIO Config Load', cmd: 'node -e "import(\'./wdio.conf.js\').then(m => console.log(\'config loaded\')).catch(e => process.exit(1))"' },
    { name: 'Mochawesome Generate', cmd: 'node scripts/generate-report.js' }
];

let passed = 0;
let failed = 0;

for (const check of checks) {
    try {
        execSync(check.cmd, { shell: true, stdio: 'pipe' });
        console.log(`✅ ${check.name}: PASS`);
        passed++;
    } catch (error) {
        console.error(`❌ ${check.name}: FAIL`);
        failed++;
    }
}

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
