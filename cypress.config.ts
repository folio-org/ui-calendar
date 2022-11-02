import { defineConfig } from 'cypress';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });
dotenv.config();

export default defineConfig({
  fixturesFolder: 'src/test/cypress/fixtures',
  env: {
    // stripes username and password
    diku_login: process.env.DIKU_USERNAME,
    diku_password: process.env.DIKU_PASSWORD,
    okapi_tenant: 'diku',
    calendar_api_url: 'https://folio-dev-bama-okapi.ci.folio.org/calendar/calendars'
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      return config;
    },
    supportFile: 'src/test/cypress/support/e2e.ts',
    downloadsFolder: 'src/test/cypress/downloads',
    specPattern: 'src/test/cypress/tests/*.cy.{js,jsx,ts,tsx}',
  },
});
