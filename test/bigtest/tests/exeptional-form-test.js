import { expect } from 'chai';

import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import CalendarSettingsInteractor from '../interactors/calendar-settings';

import translation from '../../../translations/ui-calendar/en';

describe.only('open exeptional form', () => {
  const calendarSettingsInteractor = new CalendarSettingsInteractor();
  let servicePoint;

  setupApplication();

  beforeEach(function () {
    servicePoint = this.server.create('servicePoint');
    this.visit(`/settings/calendar/library-hours/${servicePoint.id}`);
  });

  describe('add exceptions button', () => {
    it('should be displayed', () => {
      expect(calendarSettingsInteractor.servicePointDetails.addExeptionsButton.isPresent).to.be.true;
    });

    it('should have proper text', () => {
      expect(calendarSettingsInteractor.servicePointDetails.addExeptionsButton.text).to.equal(
        translation.openCalendar
      );
    });

    describe('add exceptions button click', () => {
      beforeEach(async () => {
        await calendarSettingsInteractor.servicePointDetails.addExeptionsButton.click();
      });

      it('opening period form should be presented', () => {
        expect(calendarSettingsInteractor.exceptionalForm.isPresent).to.be.true;
      });

      it('new period button should be presented', () => {
        expect(calendarSettingsInteractor.exceptionalForm.newPeriod.isPresent).to.be.true;
      });

      describe('new period button click', () => {
        beforeEach(async () => {
          await calendarSettingsInteractor.exceptionalForm.newPeriod.click();
        });

        it('exceptional period editor should be presented', () => {
          expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.isPresent).to.be.true;
        });
      });
    });
  });
});
