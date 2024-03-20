jest.mock('@folio/stripes/smart-components', () => ({
  Settings: jest.fn(() => 'Settings'),
}));
