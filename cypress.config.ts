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
    OKAPI_HOST: 'https://folio-testing-cypress-okapi.ci.folio.org',
    OKAPI_TENANT: 'diku',
    calendar_api_url: 'https://folio-snapshot-okapi.dev.folio.org/calendar/calendars',
    service_point_api_url: 'https://folio-snapshot-okapi.dev.folio.org/service-points',
  },
  e2e: {
    baseUrl: 'https://folio-testing-cypress-diku.ci.folio.org',
    setupNodeEvents(on, config) {
      return config;
    },
    supportFile: 'src/test/cypress/support/e2e.ts',
    downloadsFolder: 'src/test/cypress/downloads',
    specPattern: 'src/test/cypress/tests/*.cy.{js,jsx,ts,tsx}',
  },
});


