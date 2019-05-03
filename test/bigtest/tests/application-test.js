import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ApplicationInteractor from '../interactors/application';

describe('Application', () => {
  const app = new ApplicationInteractor();

  setupApplication();

  beforeEach(function () {
    this.server.createList('servicePoint', 2);
    this.visit('/settings/calendar');
  });

  it('renders', () => {
    expect(app.isPresent).to.be.true;
  });
});
