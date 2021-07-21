import { expect } from 'chai';

import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import setupApplication from '../../helpers/setup-application';
import CalendarSettingsInteractor from '../../interactors/calendar-settings';
import {
  endDate,
  name,
  startDateFuture,
  tomorrow,
} from '../../constants';
import { formatDisplayDateString } from '../../helpers/messageConverters';

describe('open exceptional period edit ', () => {
  describe('edit period ', () => {
    const calendarSettingsInteractor = new CalendarSettingsInteractor();
    let servicePoint;

    setupApplication();

    beforeEach(async function () {
      servicePoint = this.server.create('servicePoint');
      this.server.create('period', {
        servicePointId: servicePoint.id,
        openingDays: [
          {
            openingDay: {
              openingHour: [
                {
                  startTime: '00:00',
                  endTime: '23:59'
                }
              ],
              allDay: true,
              open: false
            }
          }
        ],
        startDate: tomorrow,
      });
      await this.visit(`/settings/calendar/library-hours/${servicePoint.id}`);
      await calendarSettingsInteractor.servicePointDetails.addExeptionsButton.click();
      await calendarSettingsInteractor.exceptionalForm.servicePointSelector.items(0).clickAndBlur();
      await calendarSettingsInteractor.exceptionalForm.bigCalendar.events(0).click();
      await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.validFrom.fillAndBlur(startDateFuture);
      await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.validTo.fillAndBlur(endDate);
      await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.name.fillAndBlur(name);
      await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.savePeriod.click();
    });

    it('exceptional period should be presented', () => {
      expect(calendarSettingsInteractor.exceptionalForm.bigCalendar.events().length > 0).to.be.true;
    });

    describe('service point details', () => {
      beforeEach(async function () {
        await calendarSettingsInteractor.servicePointDetails.closeButton.click();
        await calendarSettingsInteractor.libraryHoursSettings.items(0).click();
      });

      it('should have updated period', () => {
        expect(calendarSettingsInteractor.servicePointDetails.nextPeriod.list(0).text).to.equal(
          `${formatDisplayDateString(startDateFuture)} - ${formatDisplayDateString(endDate)} (${name})`
        );
      });
    });
  });
});
