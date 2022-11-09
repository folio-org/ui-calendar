import HTML from '@folio/stripes-testing/interactors/baseHTML';

export default HTML.extend('headline')
  .selector('[class^="headline-"]')
  .locator(el => el.textContent);
