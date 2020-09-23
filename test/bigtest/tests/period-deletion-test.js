import { expect } from 'chai';

import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';

import CalendarSettingsInteractor from '../interactors/calendar-settings';
import setupApplication from '../helpers/setup-application';
import parseMessageFromJsx from '../helpers/parseMessageFromJsx';
import { formatDateString } from '../helpers/messageConverters';

import translation from '../../../translations/ui-calendar/en';

describe('period deletion', () => {
  const calendarSettingsInteractor = new CalendarSettingsInteractor();
  let servicePoint;
  let period;

  setupApplication();

  beforeEach(function () {
    servicePoint = this.server.create('servicePoint');
    period = this.server.create('period', {
      servicePointId: servicePoint.id
    });
    this.visit(`/settings/calendar/library-hours/${servicePoint.id}`);
  });

  beforeEach(async () => {
    await calendarSettingsInteractor.whenLoaded();
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

    describe('delete button', () => {
      it('should be displayed', () => {
        expect(calendarSettingsInteractor.openingPeriodForm.formHeader.deleteButton.isPresent).to.be.true;
      });

      it('should be active', () => {
        expect(calendarSettingsInteractor.openingPeriodForm.formHeader.isDeleteButtonDisabled).to.be.false;
      });

      it('should have proper text', () => {
        expect(calendarSettingsInteractor.openingPeriodForm.formHeader.deleteButton.text).to.equal(
          translation.deleteButton
        );
      });

      describe('delete button click', () => {
        beforeEach(async () => {
          await calendarSettingsInteractor.openingPeriodForm.formHeader.deleteButton.click();
        });

        describe('delete confirmation modal', () => {
          it('should be displayed', () => {
            expect(calendarSettingsInteractor.openingPeriodForm.deleteConfirmationModal.isPresent).to.be.true;
          });

          it('should have proper header', () => {
            expect(calendarSettingsInteractor.openingPeriodForm.deleteConfirmationModal.header.text).to.equal(
              translation.deleteQuestionTitle
            );
          });

          it('should have proper context', () => {
            expect(calendarSettingsInteractor.openingPeriodForm.deleteConfirmationModal.modalContent.text).to.equal(
              parseMessageFromJsx(
                translation.deleteQuestionMessage,
                { name: period.name }
              )
            );
          });

          describe('cancel button', () => {
            it('should be displayed', () => {
              expect(calendarSettingsInteractor.openingPeriodForm.deleteConfirmationModal.cancelButton.isPresent).to.be.true;
            });

            describe('cancel button click', () => {
              beforeEach(async () => {
                await calendarSettingsInteractor.openingPeriodForm.deleteConfirmationModal.cancelButton.click();
              });

              it('opening period form should be displayed', () => {
                expect(calendarSettingsInteractor.openingPeriodForm.isPresent).to.be.true;
              });

              it('delete confirmation modal should not be displayed', () => {
                expect(calendarSettingsInteractor.openingPeriodForm.deleteConfirmationModal.modalContent.isPresent).to.be.false;
              });
            });
          });

          describe('confirmation button', () => {
            it('should be displayed', () => {
              expect(calendarSettingsInteractor.openingPeriodForm.deleteConfirmationModal.confirmButton.isPresent).to.be.true;
            });

            describe('confirmation button click', () => {
              beforeEach(async () => {
                await calendarSettingsInteractor.openingPeriodForm.deleteConfirmationModal.confirmButton.click();
              });

              it('service point details be displayed', () => {
                expect(calendarSettingsInteractor.servicePointDetails.isPresent).to.be.true;
              });

              it('next period should not be displayed', () => {
                expect(calendarSettingsInteractor.servicePointDetails.nextPeriod.isPresent).to.be.false;
              });
            });
          });
        });
      });
    });
  });
});
