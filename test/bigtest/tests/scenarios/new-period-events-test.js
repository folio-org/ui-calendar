import { expect } from 'chai';

import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import CalendarSettingsInteractor from '../../interactors/calendar-settings';
import setupApplication from '../../helpers/setup-application';
import {
  name,
  endDate,
  startDateFuture,
} from '../../constants';

const initialEventText = '12:00 AM – 1:30 AM';
const modifiedEventText = '3:00 AM – 4:30 AM';

describe('calendar events', () => {
  const calendarSettingsInteractor = new CalendarSettingsInteractor();

  describe('next period', () => {
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

      const timeslots = await calendarSettingsInteractor.openingPeriodForm.bigCalendar.timeSlots();

      await calendarSettingsInteractor.openingPeriodForm.bigCalendar.simulateClick(
        timeslots[48],
        timeslots[50],
      );
    });

    it('should have proper event text', () => {
      expect(calendarSettingsInteractor.openingPeriodForm.bigCalendar.eventLabels(0).text).to.equal(initialEventText);
    });

    describe('event deletion', () => {
      beforeEach(async function () {
        await calendarSettingsInteractor.openingPeriodForm.bigCalendar.eventDeleteButtons(0).click();
      });

      it('event should be deleted', () => {
        expect(calendarSettingsInteractor.openingPeriodForm.bigCalendar.events().length).to.equal(0);
      });
    });

    describe.skip('dnd', () => {
      beforeEach(async function () {
        const timeslots = await calendarSettingsInteractor.openingPeriodForm.bigCalendar.timeSlots();

        await calendarSettingsInteractor.openingPeriodForm.bigCalendar.eventDeleteButtons(0).click();
        await calendarSettingsInteractor.openingPeriodForm.bigCalendar.simulateClick(
          timeslots[54],
          timeslots[56],
        );
      });

      it('should have proper event text', () => {
        expect(calendarSettingsInteractor.openingPeriodForm.bigCalendar.eventLabels(0).text).to.equal(modifiedEventText);
      });
    });
  });
});
