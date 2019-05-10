import { expect } from 'chai';

import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';
import { faker } from '@bigtest/mirage';

import setupApplication from '../helpers/setup-application';
import formatDateString from '../helpers/formatDateString';
import CalendarSettingsInteractor from '../interactors/calendar-settings';

import translation from '../../../translations/ui-calendar/en';

describe('service point details', () => {
  const calendarSettingsInteractor = new CalendarSettingsInteractor();
  let servicePoint;

  setupApplication();

  beforeEach(function () {
    servicePoint = this.server.create('servicePoint');
    this.visit(`/settings/calendar/library-hours/${servicePoint.id}`);
  });

  it('should be presented', () => {
    expect(calendarSettingsInteractor.servicePointDetails.isPresent).to.be.true;
  });

  it('should have proper title', () => {
    expect(calendarSettingsInteractor.servicePointDetails.title.text).to.equal(servicePoint.name);
  });

  describe('name', () => {
    it('should be displayed', () => {
      expect(calendarSettingsInteractor.servicePointDetails.name.isPresent).to.be.true;
    });

    it('should have proper label', () => {
      expect(calendarSettingsInteractor.servicePointDetails.name.label.text).to.equal(translation.name);
    });

    it('should have proper value', () => {
      expect(calendarSettingsInteractor.servicePointDetails.name.value.text).to.equal(servicePoint.name);
    });
  });

  describe('code', () => {
    it('should be displayed', () => {
      expect(calendarSettingsInteractor.servicePointDetails.code.isPresent).to.be.true;
    });

    it('should have proper label', () => {
      expect(calendarSettingsInteractor.servicePointDetails.code.label.text).to.equal(translation.code);
    });

    it('should have proper value', () => {
      expect(calendarSettingsInteractor.servicePointDetails.code.value.text).to.equal(servicePoint.code);
    });
  });

  describe('regular library hours', () => {
    it('should be displayed', () => {
      expect(calendarSettingsInteractor.servicePointDetails.regularLibraryHours.isPresent).to.be.true;
    });

    it('should have proper text', () => {
      expect(calendarSettingsInteractor.servicePointDetails.regularLibraryHours.text).to.equal(
        translation.regularLibraryHours
      );
    });
  });

  describe('current period', () => {
    let period;

    it.always('should not be displayed', () => {
      expect(calendarSettingsInteractor.servicePointDetails.currentPeriod.isPresent).to.be.false;
    });

    describe('service point with current periods', () => {
      beforeEach(function () {
        period = this.server.create('period', { servicePointId: servicePoint.id, startDate: faker.date.past() });
        this.visit(`/settings/calendar/library-hours/${servicePoint.id}`);
      });

      it('should be displayed', () => {
        expect(calendarSettingsInteractor.servicePointDetails.currentPeriod.isPresent).to.be.true;
      });

      it('should have proper label', () => {
        expect(calendarSettingsInteractor.servicePointDetails.currentPeriod.label.text).to.equal(
          translation.current
        );
      });

      it('should have proper value', () => {
        expect(calendarSettingsInteractor.servicePointDetails.currentPeriod.value.text).to.equal(
          `${formatDateString(period.startDate)} - ${formatDateString(period.endDate)} (${period.name})`
        );
      });
    });
  });

  describe('current period times', () => {
    it.always('should not be displayed', () => {
      expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.isPresent).to.be.false;
    });
  });

  describe('next period', () => {
    it('should not be displayed', () => {
      expect(calendarSettingsInteractor.servicePointDetails.nextPeriod.isPresent).to.be.false;
    });
  });

  describe('new period button', () => {
    it('should be displayed', () => {
      expect(calendarSettingsInteractor.servicePointDetails.newPeriodButton.isPresent).to.be.true;
    });

    it('should have proper text', () => {
      expect(calendarSettingsInteractor.servicePointDetails.newPeriodButton.text).to.equal(
        translation.newButton
      );
    });

    describe('new period button click', () => {
      beforeEach(async () => {
        await calendarSettingsInteractor.servicePointDetails.newPeriodButton.click();
      });

      it('opening period form should be presented', () => {
        expect(calendarSettingsInteractor.openingPeriodForm.isPresent).to.be.true;
      });
    });
  });

  describe('clone period button', () => {
    it('should be displayed', () => {
      expect(calendarSettingsInteractor.servicePointDetails.clonePeriodButton.isPresent).to.be.true;
    });

    it('should have proper text', () => {
      expect(calendarSettingsInteractor.servicePointDetails.clonePeriodButton.text).to.equal(
        translation.cloneSettings
      );
    });

    it('should be disabled', () => {
      expect(calendarSettingsInteractor.servicePointDetails.isclonePeriodButtonDisabled).to.be.true;
    });
  });

  describe('actual library hours', () => {
    describe('actual library hours header', () => {
      it('should be displayed', () => {
        expect(calendarSettingsInteractor.servicePointDetails.actualLibraryHoursHeader.isPresent).to.be.true;
      });

      it('should have proper text', () => {
        expect(calendarSettingsInteractor.servicePointDetails.actualLibraryHoursHeader.text).to.equal(
          translation.actualLibraryHours
        );
      });
    });

    describe('regular opening hours with exceptions', () => {
      it('should be displayed', () => {
        expect(calendarSettingsInteractor.servicePointDetails.regularOpeningHoursWithExceptions.isPresent).to.be.true;
      });

      it('should have proper text', () => {
        expect(calendarSettingsInteractor.servicePointDetails.regularOpeningHoursWithExceptions.text).to.equal(
          translation.regularOpeningHoursWithExceptions
        );
      });
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
      });
    });
  });
});
