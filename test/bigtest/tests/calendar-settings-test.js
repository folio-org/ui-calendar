import { sortBy } from 'lodash';
import { expect } from 'chai';

import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import CalendarSettingsInteractor from '../interactors/calendar-settings';

import translation from '../../../translations/ui-calendar/en';

const settingsTitle = 'Settings';
const servicePointsAmount = 5;

describe('Calendar settings', () => {
  const calendarSettingsInteractor = new CalendarSettingsInteractor();
  let servicePoints;

  setupApplication();

  beforeEach(function () {
    servicePoints = this.server.createList('servicePoint', servicePointsAmount);
    this.visit('/settings');
  });

  it('renders', () => {
    expect(calendarSettingsInteractor.isPresent).to.be.true;
  });

  describe('settings', () => {
    it('should be presented', () => {
      expect(calendarSettingsInteractor.allSettings.isPresent).to.be.true;
    });

    it('should have proper title', () => {
      expect(calendarSettingsInteractor.allSettings.title.text).to.equal(settingsTitle);
    });

    it('should have proper amount of links', () => {
      expect(calendarSettingsInteractor.allSettings.items().length).to.equal(2);
    });

    describe('calendar link', () => {
      it('should be presented', () => {
        expect(calendarSettingsInteractor.allSettings.items(0).isPresent).to.be.true;
      });

      it('should have proper text', () => {
        expect(calendarSettingsInteractor.allSettings.items(0).text).to.equal(translation['meta.title']);
      });
    });
  });

  describe('calendar settings', () => {
    beforeEach(async () => {
      await calendarSettingsInteractor.allSettings.items(0).click();
    });

    it('should be presented', () => {
      expect(calendarSettingsInteractor.calendarSettings.isPresent).to.be.true;
    });

    it('should have proper title', () => {
      expect(calendarSettingsInteractor.calendarSettings.title.text).to.equal(translation['meta.title']);
    });

    it('should have proper amount of links', () => {
      expect(calendarSettingsInteractor.calendarSettings.items().length).to.equal(1);
    });

    describe('library hours link', () => {
      it('should be presented', () => {
        expect(calendarSettingsInteractor.calendarSettings.items(0).isPresent).to.be.true;
      });

      it('should have proper text', () => {
        expect(calendarSettingsInteractor.calendarSettings.items(0).text).to.equal(translation['settings.library_hours']);
      });
    });
  });

  describe('library hours settings', () => {
    beforeEach(async () => {
      await calendarSettingsInteractor.allSettings.items(0).click();
      await calendarSettingsInteractor.calendarSettings.items(0).click();
    });

    it('should be presented', () => {
      expect(calendarSettingsInteractor.libraryHoursSettings.isPresent).to.be.true;
    });

    it('should have proper title', () => {
      expect(calendarSettingsInteractor.libraryHoursSettings.title.text).to.equal(translation['settings.library_hours']);
    });

    it('should have proper amount of links', () => {
      expect(calendarSettingsInteractor.libraryHoursSettings.items().length).to.equal(servicePointsAmount);
    });

    describe('service point link', () => {
      it('should be presented', () => {
        expect(calendarSettingsInteractor.libraryHoursSettings.items(0).isPresent).to.be.true;
      });

      it('should have proper text', () => {
        expect(calendarSettingsInteractor.libraryHoursSettings.items(0).text).to.equal(
          sortBy(servicePoints, 'name')[0].name
        );
      });
    });

    describe('service point link', () => {
      it('should be presented', () => {
        expect(calendarSettingsInteractor.libraryHoursSettings.items(0).isPresent).to.be.true;
      });

      it('should have proper text', () => {
        expect(calendarSettingsInteractor.libraryHoursSettings.items(0).text).to.equal(
          sortBy(servicePoints, 'name')[0].name
        );
      });
    });
  });
});
