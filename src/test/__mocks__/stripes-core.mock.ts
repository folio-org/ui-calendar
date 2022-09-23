jest.mock('@folio/stripes-core/src/components', () => ({}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes-core'),
  useOkapiKy: jest.fn()
}));
