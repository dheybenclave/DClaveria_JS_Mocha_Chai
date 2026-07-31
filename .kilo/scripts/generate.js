#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const requirement = args.find(a => a.startsWith('--requirement='))?.replace('--requirement=', '') || 'user can search for flights';

console.log(`🎯 Generate Test from Requirement: "${requirement}"\n`);

const specTemplate = `import { expect } from 'chai';
import HomePage from '../../src/pageobjects/home.page.js';
import FlightSearchPage from '../../src/pageobjects/search.page.js';
import logger from '../../src/utils/logger.js'; 

describe('Generated Test: ${requirement}', () => {
   
  const homePage = new HomePage();
  const commonComponent = new NavbarComponent();

  beforeEach(async () => {
    // Destroys current browser state and spins up a brand new instance
    await browser.reloadSession();
    logger.info('Navigating to home page');

  });

    it('@tc_N should ${requirement}', async () => {
        logger.info('Executing: ${requirement}');
        // TODO: Implement test steps based on requirement
        expect(true, 'Test placeholder').to.be.true;
    });
});
`;

const outputPath = path.resolve(process.cwd(), 'src/specs/web/generated/generated.spec.js');

try {
    execSync(`mkdir -p "${path.dirname(outputPath)}"`, { shell: true });
    execSync(`echo "${specTemplate.replace(/"/g, '\\"')}" > "${outputPath}"`, { shell: true });
    console.log(`✅ Generated spec: ${outputPath}`);
    console.log('\n📝 Next steps:');
    console.log('   1. Review and update the placeholder test');
    console.log('   2. Add proper @tc_N tag');
    console.log('   3. Implement test steps in page objects');
    console.log('   4. Run collection: npx wdio run ./config/wdio.local.conf.js --dry-run');
} catch (error) {
    console.error('❌ Failed to generate test:', error.message);
    process.exit(1);
}
