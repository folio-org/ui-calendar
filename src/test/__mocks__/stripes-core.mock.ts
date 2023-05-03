jest.mock('@folio/stripes/core', () => {
  const STRIPES = {
    hasPerm: () => true,
  };

  return {
    ...jest.requireActual('@folio/stripes/core'),
    IfInterface: jest.fn(({ name, children }) => {
      return name === 'interface' || name === 'service-points-users'
        ? children
        : null;
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
    useOkapiKy: jest.fn(),
    useStripes: () => STRIPES,
  };
});
