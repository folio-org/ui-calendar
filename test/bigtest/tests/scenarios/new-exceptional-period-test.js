import { expect } from 'chai';

import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import setupApplication from '../../helpers/setup-application';
import CalendarSettingsInteractor from '../../interactors/calendar-settings';

import {
  name,
  endDate,
  endTime,
  startTime,
  startDatePast,
} from '../../constants';

describe('open exceptional form', () => {
  const servicePointAmount = 2;
  const testServicePointId = 1;
  const calendarSettingsInteractor = new CalendarSettingsInteractor();
  let servicePoint;

  setupApplication();

  beforeEach(async function () {
    servicePoint = this.server.createList('servicePoint', servicePointAmount);
    this.visit(`/settings/calendar/library-hours/${servicePoint[0].id}`);
    await calendarSettingsInteractor.servicePointDetails.addExeptionsButton.click();
    await calendarSettingsInteractor.exceptionalForm.newPeriod.click();
    await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.validFrom.fillAndBlur(startDatePast);
    await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.validTo.fillAndBlur(endDate);
    await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.name.fillAndBlur(name);
    await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.servicePoints.items(testServicePointId).clickAndBlur();
  });

  describe('new period', () => {
    beforeEach(async function () {
      await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.openingTime.fillInput(startTime);
      await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.closingTime.fillInput(endTime);
      await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.savePeriod.click();
    });

    describe('service point selector', () => {
      it('should be displayed', () => {
        expect(calendarSettingsInteractor.exceptionalForm.servicePointSelector.isPresent).to.be.true;
      });

      it('should have proper amount of service points', () => {
        expect(calendarSettingsInteractor.exceptionalForm.servicePointSelector.items().length).to.equal(
          servicePointAmount
        );
      });

      describe('service point click', () => {
        beforeEach(async function () {
          await calendarSettingsInteractor.exceptionalForm.servicePointSelector.items(testServicePointId).clickAndBlur();
        });

        it('exceptional period should be created', () => {
          expect(calendarSettingsInteractor.exceptionalForm.bigCalendar.events().length > 0).to.be.true;
        });
      });
    });
  });

  describe('closed period', () => {
    beforeEach(async function () {
      await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.closedCheckbox.clickAndBlur();
      await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.savePeriod.click();
    });

    describe('service point selector', () => {
      it('should be displayed', () => {
        expect(calendarSettingsInteractor.exceptionalForm.servicePointSelector.isPresent).to.be.true;
      });

      it('should have proper amount of service points', () => {
        expect(calendarSettingsInteractor.exceptionalForm.servicePointSelector.items().length).to.equal(
          servicePointAmount
        );
      });

      describe('service point click', () => {
        beforeEach(async function () {
          await calendarSettingsInteractor.exceptionalForm.servicePointSelector.items(testServicePointId).clickAndBlur();
        });

        it('exceptional period should be created', () => {
          expect(calendarSettingsInteractor.exceptionalForm.bigCalendar.events().length > 0).to.be.true;
        });
      });
    });
  });

  describe('all day period', () => {
    beforeEach(async function () {
      await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.allDay.clickAndBlur();
      await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.savePeriod.click();
    });

    describe('service point selector', () => {
      it('should be displayed', () => {
        expect(calendarSettingsInteractor.exceptionalForm.servicePointSelector.isPresent).to.be.true;
      });

      it('should have proper amount of service points', () => {
        expect(calendarSettingsInteractor.exceptionalForm.servicePointSelector.items().length).to.equal(
          servicePointAmount
        );
      });

      describe('service point click', () => {
        beforeEach(async function () {
          await calendarSettingsInteractor.exceptionalForm.servicePointSelector.items(testServicePointId).clickAndBlur();
        });

        it('exceptional period should be created', () => {
          expect(calendarSettingsInteractor.exceptionalForm.bigCalendar.events().length > 0).to.be.true;
        });
      });
    });
  });
});
