import { expect } from 'chai';

import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';

import CalendarSettingsInteractor from '../../interactors/calendar-settings';
import setupApplication from '../../helpers/setup-application';
import { formatDateString } from '../../helpers/messageConverters';
import {
  name,
  endDate,
  startDatePast,
  startDateFuture,
} from '../../constants';

import translation from '../../../../translations/ui-calendar/en';

describe('new period creation', () => {
  const calendarSettingsInteractor = new CalendarSettingsInteractor();

  describe('new next period', () => {
    let servicePoint;

    setupApplication();

    beforeEach(async function () {
      servicePoint = await this.server.create('servicePoint');
      await this.visit(`/settings/calendar/library-hours/${servicePoint.id}`);

      await calendarSettingsInteractor.servicePointDetails.newPeriodButton.click();
      await calendarSettingsInteractor.openingPeriodForm.inputFields.startDate.fillAndBlur(
        startDateFuture
      );
      await calendarSettingsInteractor.openingPeriodForm.inputFields.endDate.fillAndBlur(
        endDate
      );
      await calendarSettingsInteractor.openingPeriodForm.inputFields.periodName.fillAndBlur(name);
      await calendarSettingsInteractor.openingPeriodForm.bigCalendar.click();

      const weekDays = await calendarSettingsInteractor.openingPeriodForm.bigCalendar.wholeDay();

      await calendarSettingsInteractor.openingPeriodForm.bigCalendar.simulateClick(
        weekDays[0],
        weekDays[1],
      );
      await calendarSettingsInteractor.openingPeriodForm.formHeader.saveButton.click();
    });


    it('should be displayed', () => {
      expect(calendarSettingsInteractor.servicePointDetails.nextPeriod.isPresent).to.be.true;
    });

    it('should have proper next period', () => {
      expect(calendarSettingsInteractor.servicePointDetails.nextPeriod.list(0).label.text).to.equal(
        `${formatDateString(startDateFuture)} - ${formatDateString(endDate)} (${name})`
      );
    });
  });

  describe('new current period', () => {
    let servicePoint;
    const servicePointAmount = 2;

    setupApplication();

    beforeEach(async function () {
      servicePoint = await this.server.createList('servicePoint', servicePointAmount);
      await this.visit(`/settings/calendar/library-hours/${servicePoint[0].id}`);
      await calendarSettingsInteractor.servicePointDetails.newPeriodButton.click();
      await calendarSettingsInteractor.openingPeriodForm.inputFields.startDate.fillAndBlur(
        startDatePast
      );
      await calendarSettingsInteractor.openingPeriodForm.inputFields.endDate.fillAndBlur(
        endDate
      );
      await calendarSettingsInteractor.openingPeriodForm.inputFields.periodName.fillAndBlur(name);
      await calendarSettingsInteractor.openingPeriodForm.bigCalendar.click();
      const weekDays = await calendarSettingsInteractor.openingPeriodForm.bigCalendar.wholeDay();
      await calendarSettingsInteractor.openingPeriodForm.bigCalendar.simulateClick(
        weekDays[0],
        weekDays[1],
      );
      await calendarSettingsInteractor.openingPeriodForm.formHeader.saveButton.click();
    });

    it('should be displayed', () => {
      expect(calendarSettingsInteractor.servicePointDetails.currentPeriod.isPresent).to.be.true;
    });

    it('should have proper next period', () => {
      expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.monday.value.text).to.equal(
        translation['settings.allDay']
      );
    });
  });
});
