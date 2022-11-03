// @ts-check
// import '../global.d';
import * as localforage from 'localforage';


Cypress.Commands.add('login', (username: string, password: string) => {
  // We use a behind-the-scenes method of ensuring we are logged
  // out, rather than using the UI, in accordance with the Best
  // Practices guidance at
  // https://docs.cypress.io/guides/references/best-practices.html#Organizing-Tests-Logging-In-Controlling-State
  localforage.removeItem('okapiSess');

  // But it's not feasible to log in to Stipes using a similar
  // behind-the-scenes approach, so we have to use the UI.
  cy.visit('');
  cy.contains('Log in');
  cy.get('#input-username').type(username);
  cy.get('#input-password').type(password);
  cy.get('#clickable-login').click();
  // Login can be too slow for the default 4-second timeout
  cy.contains('Welcome', { timeout: 10000 });

  // There seems to be a race condition here: sometimes there is
  // re-render that happens so quickly that following actions like
  //       cy.get('#app-list-item-clickable-courses-module').click()
  // fail because the button becomes detached from the DOM after the
  // get() but before the click().
  cy.wait(1000);
});

Cypress.Commands.add('loginAsAdmin', () => {
  cy.login(Cypress.env('diku_login'), Cypress.env('diku_password'));
});


Cypress.Commands.add('openCalendarSettings', (isLoggedIn = true) => {
  if (!isLoggedIn) {
    cy.loginAsAdmin();
  }
  cy.visit('settings/calendar');
});


Cypress.Commands.add('createCalendar', (testCalendarRequestBody, callback) => {
  cy.wrap(localforage.getItem('okapiSess')).then((okapiSess) => {
    expect(okapiSess).to.have.property('token');
    cy.request({
      url: Cypress.env('calendar_api_url'),
      method: 'POST',
      body: testCalendarRequestBody,
      headers: {
        'x-okapi-tenant': Cypress.env('okapi_tenant'),
        'x-okapi-token': okapiSess.token
      }
    }).then((response) => {
      expect(response.status).equals(201);
      callback(response);
    });
  });
});

Cypress.Commands.add('deleteCalendar', (calendarID, callback = null) => {
  cy.wrap(localforage.getItem('okapiSess')).then(okapiSess => {
    expect(okapiSess).to.have.property('token');
    cy.request({
      url: Cypress.env('calendar_api_url') + '/' + calendarID,
      method: 'DELETE',
      headers: {
        'x-okapi-tenant': 'diku',
        'x-okapi-token': okapiSess.token
      }
    }).then((response) => {
      expect(response.status).equals(204);
      if (callback) { callback(response); }
    });
  });
});





