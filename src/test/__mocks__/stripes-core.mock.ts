// jest.mock('@folio/stripes/core', () => ({
//   ...jest.requireActual('@folio/stripes-core'),
//   useOkapiKy: jest.fn(),
//   useStripes: () => ({
//     hasPerm: jest.fn().mockReturnValue(true),
//   })
// }));

jest.mock('@folio/stripes/core', () => {
  const STRIPES = {
    actionNames: [],
    bindings: {},
    clone: jest.fn(),
    config: {
      logCategories: '',
      logPrefix: '',
      logTimestamp: true,
      showPerms: true,
      showHomeLink: true,
      listInvisiblePerms: true,
      disableAuth: false,
      hasAllPerms: false,
    },
    currency: 'USD',
    discovery: {
      interfaces: {},
      isFinished: true,
      modules: {},
      okapi: {},
    },
    epics: {
      add: jest.fn(),
      middleware: jest.fn(),
    },
    hasInterface: () => true,
    hasPerm: () => true,
    icons: {},
    locale: 'en-US',
    logger: {
      log: () => {},
    },
    metadata: {},
    okapi: {
      authFailure: false,
      okapiReady: true,
      tenant: 'diku',
      token: 'c0ffee',
      translations: {
        'stripes-components.Datepicker.calendar': 'calendar',
        'stripes-components.Datepicker.calendarDaysList': 'calendar days list.',
        'stripes-core.button.cancel': [{ type: 0, value: 'Cancel' }],
        'ui-users.permission.modal.list.pane.header': 'Permissions',
        'ui-users.permission.modal.list.pane.header.array': [{ type: 0, value: 'Permissions' }],
        default: false,
      },
      url: 'https://folio-testing-okapi.dev.folio.org',
      withoutOkapi: false,
    },
    plugins: {},
    setBindings: jest.fn(),
    setCurrency: jest.fn(),
    setLocale: jest.fn(),
    setSinglePlugin: jest.fn(),
    setTimezone: jest.fn(),
    setToken: jest.fn(),
    store: {
      getState: () => ({
        okapi: {
          token: 'abc',
        },
      }),
      dispatch: () => {},
      subscribe: () => {},
      replaceReducer: () => {},
    },
    timezone: 'UTC',
    user: {
      perms: {},
      user: {
        addresses: [],
        firstName: 'Testy',
        lastName: 'McTesterson',
        email: 'test@folio.org',
        id: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
        username: 'diku_admin',
      },
    },
    withOkapi: true,
  };

  return {
    ...jest.requireActual('@folio/stripes/core'),
    IfInterface: jest.fn(({ name, children }) => {
      return name === 'interface' || name === 'service-points-users' ? children : null;
    }),
    IfPermission: jest.fn(({ perm, children }) => {
      if (perm === 'permission') {
        return children;
      } else if (perm.startsWith('ui-calendar')) {
        return children;
      } else if (perm.startsWith('perms')) {
        return children;
      } else {
        return null;
      }
    }),
    Pluggable: jest.fn(({ children }) => [children]),
    useStripes: () => STRIPES,
  };
});
