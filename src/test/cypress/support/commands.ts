// @ts-check
import '../global.d';


// a convenience command to get DOM elements using a test id in their data attribute
Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args);
});





