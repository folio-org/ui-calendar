import { defineConfig } from 'cypress';

export default defineConfig({
  fixturesFolder: 'src/test/cypress/fixtures',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: 'src/test/cypress/support/e2e.ts'
  },
});
