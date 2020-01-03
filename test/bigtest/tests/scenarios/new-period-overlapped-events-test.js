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
  startDatePast,
} from '../../constants';
import translation from '../../../../translations/ui-calendar/en';

describe('events for current period were created', () => {
  const calendarSettingsInteractor = new CalendarSettingsInteractor();
  let servicePoint;

  setupApplication();

  beforeEach(async function () {
    servicePoint = this.server.create('servicePoint');
    this.server.create('period', {
      servicePointId: servicePoint.id,
      startDate: startDatePast,
      endDate,
      openingDays: [
        {
          'weekdays': {
            'day': 'SUNDAY'
          },
          'openingDay': {
            'openingHour': [{
              'startTime' : '02:00',
              'endTime' : '02:30'
            }, {
              'startTime' : '02:30',
              'endTime' : '03:00'
            }, {
              'startTime' : '03:00',
              'endTime' : '07:30'
            }, {
              'startTime' : '07:30',
              'endTime' : '08:00'
            }, {
              'startTime' : '08:00',
              'endTime' : '08:30'
            }],
            'allDay': false,
            'open': true
          }
        }, {
          'weekdays': {
            'day': 'MONDAY'
          },
          'openingDay': {
            'openingHour': [{
              'startTime': '03:30',
              'endTime': '04:00'
            }],
            'allDay': false,
            'open': true
          }
        }, {
          'weekdays': {
            'day': 'TUESDAY'
          },
          'openingDay': {
            'openingHour': [{
              'startTime': '03:30',
              'endTime': '04:00'
            }],
            'allDay': false,
            'open': true
          }
        }, {
          'weekdays': {
            'day': 'WEDNESDAY'
          },
          'openingDay': {
            'openingHour': [{
              'startTime': '03:30',
              'endTime': '09:00'
            }],
            'allDay': false,
            'open': true
          }
        }, {
          'weekdays': {
            'day': 'THURSDAY'
          },
          'openingDay': {
            'openingHour': [{
              'startTime': '03:30',
              'endTime': '09:00'
            }],
            'allDay': false,
            'open': true
          }
        },
      ]
    });
    await this.visit(`/settings/calendar/library-hours/${servicePoint.id}`);
    await calendarSettingsInteractor.servicePointDetails.newPeriodButton.click();

    it('should be displayed opening period form', () => {
      expect(calendarSettingsInteractor.openingPeriodForm.inputFields.startDate.isPresent).to.be.true;
    });

    describe('show error modal if duplicated/overlapped event was created', () => {
      beforeEach(async function () {
        await calendarSettingsInteractor.openingPeriodForm.inputFields.startDate.fillAndBlur(startDatePast);
        await calendarSettingsInteractor.openingPeriodForm.inputFields.endDate.fillAndBlur(endDate);
        await calendarSettingsInteractor.openingPeriodForm.inputFields.periodName.fillAndBlur(name);
        const weekDays = await calendarSettingsInteractor.openingPeriodForm.bigCalendar.wholeDay();
        const timeSlots = await calendarSettingsInteractor.openingPeriodForm.bigCalendar.timeSlots();

        await calendarSettingsInteractor.openingPeriodForm.bigCalendar.simulateClick(
          weekDays[2],
          weekDays[3]
        );
        await calendarSettingsInteractor.openingPeriodForm.bigCalendar.simulateClick(
          timeSlots[7],
          timeSlots[15]
        );
        await calendarSettingsInteractor.openingPeriodForm.bigCalendar.simulateClick(
          timeSlots[4],
          timeSlots[8]
        );
        await calendarSettingsInteractor.openingPeriodForm.bigCalendar.simulateClick(
          timeSlots[12],
          timeSlots[16]
        );
        await calendarSettingsInteractor.openingPeriodForm.bigCalendar.simulateClick(
          timeSlots[14],
          timeSlots[15]
        );
        await calendarSettingsInteractor.openingPeriodForm.bigCalendar.simulateClick(
          timeSlots[3],
          timeSlots[20]
        );
        await calendarSettingsInteractor.openingPeriodForm.formHeader.saveButton.click();
      });
    });

    it('should be displayed error modal', () => {
      expect(calendarSettingsInteractor.openingPeriodForm.errorModal.isPresent).to.be.true;
    });

    it('should be displayed error message', () => {
      expect(calendarSettingsInteractor.openingPeriodForm.errorModal.content.text).to.equal(translation.duplication);
    });
  });
});
