import { expect } from 'chai';

import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';
import { faker } from '@bigtest/mirage';

import setupApplication from '../helpers/setup-application';
import { formatDateString } from '../helpers/messageConverters';
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

  describe('close button', () => {
    it('should be presented', () => {
      expect(calendarSettingsInteractor.servicePointDetails.closeButton.isPresent).to.be.true;
    });

    describe('close button click', () => {
      beforeEach(async () => {
        await calendarSettingsInteractor.servicePointDetails.closeButton.click();
      });

      it('service point details should not be presented', () => {
        expect(calendarSettingsInteractor.servicePointDetails.isPresent).to.be.false;
      });
    });
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

      describe('current period click', () => {
        beforeEach(async () => {
          await calendarSettingsInteractor.servicePointDetails.currentPeriod.value.click('div');
        });

        it('opening period form should be presented', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.isPresent).to.be.true;
        });
      });
    });
  });

  describe('current period times', () => {
    it.always('should not be displayed', () => {
      expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.isPresent).to.be.false;
    });

    describe('service point with current periods', () => {
      let period;

      beforeEach(function () {
        period = this.server.create('period', {
          servicePointId: servicePoint.id,
          startDate: faker.date.past(),
          openingDays: [
            {
              'weekdays' : {
                'day' : 'MONDAY'
              },
              'openingDay' : {
                'openingHour' : [{
                  'startTime' : '02:00',
                  'endTime' : '08:30'
                }],
                'allDay' : false,
                'open' : true
              }
            }, {
              'weekdays' : {
                'day' : 'TUESDAY'
              },
              'openingDay' : {
                'openingHour' : [{
                  'startTime' : '03:30',
                  'endTime' : '04:00'
                }],
                'allDay' : false,
                'open' : true
              }
            }, {
              'weekdays' : {
                'day' : 'WEDNESDAY'
              },
              'openingDay' : {
                'openingHour' : [],
                'allDay' : true,
                'open' : true
              }
            }, {
              'weekdays' : {
                'day' : 'THURSDAY'
              },
              'openingDay' : {
                'openingHour' : [],
                'allDay' : true,
                'open' : false
              }
            },
          ]
        });
        this.visit(`/settings/calendar/library-hours/${servicePoint.id}`);
      });

      it('should be displayed', () => {
        expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.isPresent).to.be.true;
      });

      describe('sunday', () => {
        it('should be displayed', () => {
          expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.sunday.isPresent).to.be.true;
        });

        it('should have proper label', () => {
          expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.sunday.label.text).to.equal(
            translation.sunDayShort
          );
        });

        it('should have proper value', () => {
          expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.sunday.value.text).to.equal(
            translation['settings.closed']
          );
        });
      });

      describe('monday', () => {
        it('should be displayed', () => {
          expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.monday.isPresent).to.be.true;
        });

        it('should have proper label', () => {
          expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.monday.label.text).to.equal(
            translation.monDayShort
          );
        });

        it('should have proper value', () => {
          expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.monday.value.text).to.equal(
            `${period.openingDays[0].openingDay.openingHour[0].startTime} - ${period.openingDays[0].openingDay.openingHour[0].endTime}`
          );
        });
      });

      describe('tuesday', () => {
        it('should be displayed', () => {
          expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.tuesday.isPresent).to.be.true;
        });

        it('should have proper label', () => {
          expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.tuesday.label.text).to.equal(
            translation.tueDayShort
          );
        });

        it('should have proper value', () => {
          expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.tuesday.value.text).to.equal(
            `${period.openingDays[1].openingDay.openingHour[0].startTime} - ${period.openingDays[1].openingDay.openingHour[0].endTime}`
          );
        });
      });

      describe('wednesday', () => {
        it('should be displayed', () => {
          expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.wednesday.isPresent).to.be.true;
        });

        it('should have proper label', () => {
          expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.wednesday.label.text).to.equal(
            translation.wedDayShort
          );
        });

        it('should have proper value', () => {
          expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.wednesday.value.text).to.equal(
            translation['settings.allDay']
          );
        });
      });

      describe('thursday', () => {
        it('should be displayed', () => {
          expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.thursday.isPresent).to.be.true;
        });

        it('should have proper label', () => {
          expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.thursday.label.text).to.equal(
            translation.thuDayShort
          );
        });

        it('should have proper value', () => {
          expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.thursday.value.text).to.equal(
            translation['settings.closed']
          );
        });
      });

      describe('friday', () => {
        it('should be displayed', () => {
          expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.friday.isPresent).to.be.true;
        });

        it('should have proper label', () => {
          expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.friday.label.text).to.equal(
            translation.friDayShort
          );
        });

        it('should have proper value', () => {
          expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.friday.value.text).to.equal(
            translation['settings.closed']
          );
        });
      });

      describe('saturday', () => {
        it('should be displayed', () => {
          expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.saturday.isPresent).to.be.true;
        });

        it('should have proper label', () => {
          expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.saturday.label.text).to.equal(
            translation.satDayShort
          );
        });

        it('should have proper value', () => {
          expect(calendarSettingsInteractor.servicePointDetails.currentPeriodTimes.saturday.value.text).to.equal(
            translation['settings.closed']
          );
        });
      });
    });
  });

  describe('next period', () => {
    it.always('should not be displayed', () => {
      expect(calendarSettingsInteractor.servicePointDetails.nextPeriod.isPresent).to.be.false;
    });

    describe('service point with next period', () => {
      let period;

      beforeEach(function () {
        period = this.server.create('period', {
          servicePointId: servicePoint.id
        });
      });

      it('should be displayed', () => {
        expect(calendarSettingsInteractor.servicePointDetails.nextPeriod.isPresent).to.be.true;
      });

      it('should have proper header', () => {
        expect(calendarSettingsInteractor.servicePointDetails.nextPeriod.header.text).to.equal(
          translation.nextPeriod
        );
      });

      it('should have proper amount of periods', () => {
        expect(calendarSettingsInteractor.servicePointDetails.nextPeriod.list().length).to.equal(1);
      });

      it('should have proper value', () => {
        expect(calendarSettingsInteractor.servicePointDetails.nextPeriod.list(0).text).to.equal(
          `${formatDateString(period.startDate)} - ${formatDateString(period.endDate)} (${period.name})`
        );
      });

      describe('next period click', () => {
        beforeEach(async () => {
          await calendarSettingsInteractor.servicePointDetails.nextPeriod.list(0).click();
        });

        it('opening period form should be presented', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.isPresent).to.be.true;
        });
      });
    });

    const nextPeriodAmount = 3;

    describe('service point with several next periods', () => {
      beforeEach(function () {
        this.server.createList('period', nextPeriodAmount, {
          servicePointId: servicePoint.id
        });
      });

      it('should be displayed', () => {
        expect(calendarSettingsInteractor.servicePointDetails.nextPeriod.isPresent).to.be.true;
      });

      it('should have proper header', () => {
        expect(calendarSettingsInteractor.servicePointDetails.nextPeriod.header.text).to.equal(
          translation.nextPeriod
        );
      });

      it('should have proper amount of periods', () => {
        expect(calendarSettingsInteractor.servicePointDetails.nextPeriod.list().length).to.equal(nextPeriodAmount);
      });
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
