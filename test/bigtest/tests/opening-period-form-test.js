import { expect } from 'chai';

import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import CalendarSettingsInteractor from '../interactors/calendar-settings';
import { getRequiredLabel } from '../helpers/messageConverters';

import translation from '../../../translations/ui-calendar/en';

describe('opening period form', () => {
  const calendarSettingsInteractor = new CalendarSettingsInteractor();
  let servicePoint;

  setupApplication();

  describe('new opening period form', () => {
    beforeEach(async function () {
      servicePoint = this.server.create('servicePoint');
      this.visit(`/settings/calendar/library-hours/${servicePoint.id}`);
      await calendarSettingsInteractor.servicePointDetails.newPeriodButton.click();
    });

    it('opening period form should be presented', () => {
      expect(calendarSettingsInteractor.openingPeriodForm.isPresent).to.be.true;
    });

    describe('form header', () => {
      it('should be displayed', () => {
        expect(calendarSettingsInteractor.openingPeriodForm.formHeader.isPresent).to.be.true;
      });

      describe('close button', () => {
        it('should be displayed', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.formHeader.closeButton.isPresent).to.be.true;
        });

        it('should be active', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.formHeader.isCloseButtonDisabled).to.be.false;
        });

        describe('close button click', () => {
          beforeEach(async () => {
            await calendarSettingsInteractor.openingPeriodForm.formHeader.closeButton.click();
          });

          it('opening period form should not be displayed', () => {
            expect(calendarSettingsInteractor.openingPeriodForm.isPresent).to.be.false;
          });
        });
      });

      describe('title', () => {
        it('should be displayed', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.formHeader.title.isPresent).to.be.true;
        });

        it('should have proper text', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.formHeader.title.text).to.equal(
            translation.regularLibraryValidityPeriod
          );
        });
      });

      describe('delete button', () => {
        it('should be displayed', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.formHeader.deleteButton.isPresent).to.be.true;
        });

        it('should be disabled', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.formHeader.isDeleteButtonDisabled).to.be.true;
        });

        it('should have proper text', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.formHeader.deleteButton.text).to.equal(
            translation.deleteButton
          );
        });
      });

      describe('save button', () => {
        it('should be displayed', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.formHeader.saveButton.isPresent).to.be.true;
        });

        it('should be active', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.formHeader.isSaveButtonDisabled).to.be.false;
        });

        it('should have proper text', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.formHeader.saveButton.text).to.equal(
            translation.saveButton
          );
        });
      });

      describe('saves as template button', () => {
        it('should be displayed', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.formHeader.saveAsTemlateButton.isPresent).to.be.true;
        });

        it('should be disabled', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.formHeader.isSaveAsTemlateButtonDisabled).to.be.true;
        });

        it('should have proper text', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.formHeader.saveAsTemlateButton.text).to.equal(
            translation.savesAsTemplate
          );
        });
      });
    });

    describe('input fields', () => {
      it('should be displayed', () => {
        expect(calendarSettingsInteractor.openingPeriodForm.inputFields.isPresent).to.be.true;
      });

      describe('start day', () => {
        it('should be displayed', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.inputFields.startDate.isPresent).to.be.true;
        });

        it('should have proper label', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.inputFields.startDate.labelText).to.equal(
            getRequiredLabel(translation.validFrom, false)
          );
        });
      });

      describe('end day', () => {
        it('should be displayed', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.inputFields.endDate.isPresent).to.be.true;
        });

        it('should have proper label', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.inputFields.endDate.labelText).to.equal(
            getRequiredLabel(translation.validTo, false)
          );
        });
      });

      describe('name', () => {
        it('should be displayed', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.inputFields.periodName.isPresent).to.be.true;
        });

        it('should have proper label', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.inputFields.periodName.label).to.equal(
            getRequiredLabel(translation.name, false)
          );
        });

        describe('focus and leave', () => {
          beforeEach(async () => {
            await calendarSettingsInteractor.openingPeriodForm.inputFields.periodName.focusInput();
            await calendarSettingsInteractor.openingPeriodForm.inputFields.periodName.blurInput();
          });

          it('error should be displayed', () => {
            expect(calendarSettingsInteractor.openingPeriodForm.inputFields.periodNameError.isPresent).to.be.true;
          });

          it('error should have proper test', () => {
            expect(calendarSettingsInteractor.openingPeriodForm.inputFields.periodNameError.text).to.equal(
              translation.fillIn
            );
          });
        });
      });
    });

    describe('big calendar header', () => {
      it('should be displayed', () => {
        expect(calendarSettingsInteractor.openingPeriodForm.bigCalendarHeader.isPresent).to.be.true;
      });

      describe('hedline', () => {
        it('should be displayed', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.bigCalendarHeader.hedline.isPresent).to.be.true;
        });

        it('should have proper text', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.bigCalendarHeader.hedline.text).to.equal(
            translation.regularLibraryHoursCalendar
          );
        });
      });

      describe('select template button', () => {
        it('should be displayed', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.bigCalendarHeader.selectTemplateButton.isPresent).to.be.true;
        });

        it('should have proper text', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.bigCalendarHeader.selectTemplateButton.text).to.equal(
            translation.selectTemplate
          );
        });

        it('should be disabled', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.bigCalendarHeader.isSelectTemplateButtonDisabled).to.be.true;
        });
      });

      describe('copy button', () => {
        it('should be displayed', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.bigCalendarHeader.copyButton.isPresent).to.be.true;
        });

        it('should have proper text', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.bigCalendarHeader.copyButton.text).to.equal(
            translation.copy
          );
        });

        it('should be disabled', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.bigCalendarHeader.isCopyButtonDisabled).to.be.true;
        });
      });

      describe('big galendar', () => {
        it('should be displayed', () => {
          expect(calendarSettingsInteractor.openingPeriodForm.bigCalendar.isPresent).to.be.true;
        });
      });
    });
  });
});
