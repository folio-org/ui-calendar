// @ts-check
// import '../global.d';
import * as localforage from 'localforage';
import { Link } from '@interactors/html';
import Dropdown from '../interactors/dropdown';
import Modal from '../interactors/modal';
import Pane from '../interactors/pane';
import { MultiColumnListCell } from '../interactors/multi-column-list';
import Button from '../interactors/button';



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
      url: Cypress.env('OKAPI_HOST') + '/calendar/calendars',
      method: 'POST',
      body: testCalendarRequestBody,
      headers: {
        'x-okapi-tenant': Cypress.env('okapi_tenant'),
        'x-okapi-token': okapiSess.token
      },
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 409) {
        cy.deleteCalendarUI(testCalendarRequestBody.name);
        cy.createCalendar(testCalendarRequestBody, callback);
      } else {
        expect(response.status).equals(201);
        callback(response);
      }
    });
  });
});

Cypress.Commands.add('deleteCalendar', (calendarID, callback = null) => {
  cy.wrap(localforage.getItem('okapiSess')).then(okapiSess => {
    expect(okapiSess).to.have.property('token');
    cy.request({
      url: Cypress.env('OKAPI_HOST') + '/calendar/calendars/' + calendarID,
      method: 'DELETE',
      headers: {
        'x-okapi-tenant': Cypress.env('OKAPI_TENANT'),
        'x-okapi-token': okapiSess.token
      }
    }).then((response) => {
      expect(response.status).equals(204);
      if (callback) { callback(response); }
    });
  });
});

Cypress.Commands.add('deleteCalendarUI', (calendarName) => {
  cy.openCalendarSettings();
  cy.do(
    Pane('Calendar').find(Link('All calendars')).click()
  );

  cy.do(
    Pane('All calendars').find(MultiColumnListCell(calendarName)).exists()
  );

  cy.do([
    Pane('All calendars').find(MultiColumnListCell(calendarName)).click(),
    Pane(calendarName).clickAction('Delete'),
    Modal('Confirm deletion').find(Button('Delete')).click(),
    Pane('All calendars').find(MultiColumnListCell(calendarName)).absent()
  ]);
});


Cypress.Commands.add('createServicePoint', (testServicePointRequestBody, callback) => {
  cy.wrap(localforage.getItem('okapiSess')).then((okapiSess) => {
    expect(okapiSess).to.have.property('token');
    cy.request({
      url: Cypress.env('OKAPI_HOST') + '/service-points',
      method: 'POST',
      body: testServicePointRequestBody,
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

Cypress.Commands.add('deleteServicePoint', (servicePointID, checkStatusCode = true, callback = null) => {
  cy.wrap(localforage.getItem('okapiSess')).then(okapiSess => {
    expect(okapiSess).to.have.property('token');
    cy.request({
      url: Cypress.env('OKAPI_HOST') + '/service-points/' + servicePointID,
      method: 'DELETE',
      headers: {
        'x-okapi-tenant': Cypress.env('OKAPI_TENANT'),
        'x-okapi-token': okapiSess.token
      },
      failOnStatusCode: false,
    }).then((response) => {
      if (checkStatusCode) {
        expect(response.status).equals(204);
      } else {
        expect(response.status).oneOf([204, 404]);
      }
      if (callback) { callback(response); }
    });
  });
});






/// / DON'T COPY TO STRIPES-TESTING

Cypress.Commands.add('logout', () => {
  cy.do([
    Dropdown('My profile').open(),
    Button('Log out').click(),
  ]);

  cy.expect(Button('Log in', { disabled: true }).exists());
});


const DEFAULT_SEARCH_PARAMS = {
  limit: 1000,
  query: 'cql.allRecords=1',
};

Cypress.Commands.add('okapiRequest', ({
  method = 'GET',
  path,
  searchParams = {},
  body,
  isDefaultSearchParamsRequired = true,
}) => {
  const initialParams = new URLSearchParams({ ...searchParams });
  const cypressEnvPath = `${Cypress.env('OKAPI_HOST')}/${path}`;
  if (isDefaultSearchParamsRequired) {
    Object.entries(DEFAULT_SEARCH_PARAMS).forEach(([key, value]) => initialParams.append(key, value));
  }
  const queryString = (initialParams).toString();
  cy.request({
    method,
    url: queryString ? `${cypressEnvPath}?${queryString}` : cypressEnvPath,
    headers: {
      'x-okapi-tenant': Cypress.env('OKAPI_TENANT'),
      'x-okapi-token': Cypress.env('token'),
    },
    body,
  });
});

Cypress.Commands.add('getToken', (username, password) => {
  cy
    .okapiRequest({
      method: 'POST',
      path: 'bl-users/login',
      body: { username, password },
      isDefaultSearchParamsRequired: false,
    })
    .then(({ body, headers }) => {
      const defaultServicePoint = body.servicePointsUser.servicePoints
        .find(({ id }) => id === body.servicePointsUser.defaultServicePointId);

      Cypress.env('token', headers['x-okapi-token']);
      Cypress.env('defaultServicePoint', defaultServicePoint);
    });
});

function getRandomPostfix() {
  return `${(Math.random() * 1000)
    .toString(10)}${new Date().getMilliseconds()}`;
}
Cypress.Commands.add('getFirstUserGroupId', (searchParams, patronGroupName) => {
  cy.okapiRequest({
    path: 'groups',
    searchParams,
  }).then((response) => {
    let userGroupIdx = 0;
    if (patronGroupName) {
      userGroupIdx = response.body.usergroups.findIndex(({ group }) => group === patronGroupName) || 0;
    }
    return response.body.usergroups[userGroupIdx].id;
  });
});

Cypress.Commands.add('getAdminToken', () => {
  cy.getToken(Cypress.env('diku_login'), Cypress.env('diku_password'));
});


Cypress.Commands.add('createTempUser', (permissions = [], patronGroupName) => {
  const userProperties = {
    username: `cypressTestUser${getRandomPostfix()}`,
    password: `Password${getRandomPostfix()}`
  };

  cy.getAdminToken();

  cy.getFirstUserGroupId({ limit: patronGroupName ? 100 : 1 }, patronGroupName)
    .then((userGroupdId) => {
      const queryField = 'displayName';
      cy.getPermissionsApi({ query: `(${queryField}=="${permissions.join(`")or(${queryField}=="`)}"))"` })
        .then((permissionsResponse) => {
          // Can be used to collect pairs of ui and backend permission names
          // cy.log('Initial permissions=' + permissions);
          // cy.log('internalPermissions=' + [...permissionsResponse.body.permissions.map(permission => permission.permissionName)]);
          Users.createViaApi({ ...Users.defaultUser,
            patronGroup: userGroupdId,
            username: userProperties.username,
            barcode: uuid(),
            personal: { ...Users.defaultUser.personal, lastName : userProperties.username } })
            .then(newUserProperties => {
              userProperties.userId = newUserProperties.id;
              userProperties.barcode = newUserProperties.barcode;
              userProperties.firstName = newUserProperties.firstName;
              userProperties.lastName = newUserProperties.lastName;
              cy.createRequestPreference({
                defaultDeliveryAddressTypeId: null,
                defaultServicePointId: null,
                delivery: false,
                fulfillment: 'Hold Shelf',
                holdShelf: true,
                id: uuid(),
                userId:  newUserProperties.id,
              });
              cy.setUserPassword(userProperties);
              cy.addPermissionsToNewUserApi({
                userId: userProperties.userId,
                permissions: [...permissionsResponse.body.permissions.map(permission => permission.permissionName)]
              });
              cy.overrideLocalSettings(userProperties.userId);
              cy.wrap(userProperties).as('userProperties');
            });
        });
    });
  return cy.get('@userProperties');
});




