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
  endDate,
  startDateFuture,
} from '../../constants';

import translation from '../../../../translations/ui-calendar/en';

describe('edit period', () => {
  const calendarSettingsInteractor = new CalendarSettingsInteractor();
  let servicePoint;
  let period;

  setupApplication();

  beforeEach(function () {
    servicePoint = this.server.create('servicePoint');
    period = this.server.create('period', {
      servicePointId: servicePoint.id,
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
        }]
    });
    this.visit(`/settings/calendar/library-hours/${servicePoint.id}`);
  });

  describe('next period', () => {
    it('should have proper amount of periods', () => {
      expect(calendarSettingsInteractor.servicePointDetails.nextPeriod.list().length).to.equal(1);
    });

    it('should have proper value', () => {
      expect(calendarSettingsInteractor.servicePointDetails.nextPeriod.list(0).label.text).to.equal(
        `${formatDateString(period.startDate)} - ${formatDateString(period.endDate)} (${period.name})`
      );
    });
  });

  describe('click on created period', () => {
    beforeEach(async () => {
      await calendarSettingsInteractor.servicePointDetails.nextPeriod.list(0).editButton.click();
    });

    it('opening period form should be displayed', () => {
      expect(calendarSettingsInteractor.servicePointDetails.nextPeriod.isPresent).to.be.true;
    });

    it('should have proper name', () => {
      expect(calendarSettingsInteractor.openingPeriodForm.inputFields.periodName.val).to.equal(
        period.name
      );
    });

    describe('change data', () => {
      beforeEach(async () => {
        await calendarSettingsInteractor.openingPeriodForm.inputFields.startDate.fillAndBlur(
          startDateFuture
        );
        await calendarSettingsInteractor.openingPeriodForm.inputFields.endDate.fillAndBlur(
          endDate
        );
      });

      describe('cancel button', () => {
        it('should be displayed', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.formHeader.closeButton.isPresent).to.be.true;
        });

        describe('cancel button click', () => {
          beforeEach(async () => {
            await calendarSettingsInteractor.openingPeriodForm.formHeader.closeButton.click();
          });

          describe('exit confirmation modal', () => {
            it('should be displayed', () => {
              expect(calendarSettingsInteractor.openingPeriodForm.exiteConfirmationModal.isPresent).to.be.true;
            });

            it('should have proper text', () => {
              expect(calendarSettingsInteractor.openingPeriodForm.exiteConfirmationModal.modalContent.text).to.equal(
                translation.exitQuestionMessage
              );
            });

            describe('cancel button', () => {
              it('should be displayed', () => {
                expect(calendarSettingsInteractor.openingPeriodForm.exiteConfirmationModal.cancelButton.isPresent).to.be.true;
              });

              describe('cancel button click', () => {
                beforeEach(async () => {
                  await calendarSettingsInteractor.openingPeriodForm.exiteConfirmationModal.cancelButton.click();
                });

                it('exit confirmation modal should not be displayed', () => {
                  expect(calendarSettingsInteractor.openingPeriodForm.exiteConfirmationModal.isPresent).to.be.false;
                });

                it('opening period form should be displayed', () => {
                  expect(calendarSettingsInteractor.openingPeriodForm.isPresent).to.be.true;
                });
              });
            });

            describe('confirm button', () => {
              it('should be displayed', () => {
                expect(calendarSettingsInteractor.openingPeriodForm.exiteConfirmationModal.confirmButton.isPresent).to.be.true;
              });

              describe('confirm button click', () => {
                beforeEach(async () => {
                  await calendarSettingsInteractor.openingPeriodForm.exiteConfirmationModal.confirmButton.click();
                });

                it('service point details should be displayed', () => {
                  expect(calendarSettingsInteractor.servicePointDetails.isPresent).to.be.true;
                });
              });
            });
          });
        });
      });

      describe('save period', () => {
        beforeEach(async () => {
          await calendarSettingsInteractor.openingPeriodForm.formHeader.saveButton.click();
        });

        describe('next period', () => {
          it('should have proper amount of periods', () => {
            expect(calendarSettingsInteractor.servicePointDetails.nextPeriod.list().length).to.equal(1);
          });

          it('should have proper value', () => {
            expect(calendarSettingsInteractor.servicePointDetails.nextPeriod.list(0).label.text).to.equal(
              `${startDateFuture} - ${endDate} (${period.name})`
            );
          });
        });
      });
    });
  });
});
