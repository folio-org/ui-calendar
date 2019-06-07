import { expect } from 'chai';

import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import CalendarSettingsInteractor from '../interactors/calendar-settings';

import translation from '../../../translations/ui-calendar/en';
import { getRequiredLabel } from '../helpers/messageConverters';

describe('open exeptional form', () => {
  const servicePointAmount = 2;
  const calendarSettingsInteractor = new CalendarSettingsInteractor();
  let servicePoint;

  setupApplication();

  beforeEach(function () {
    servicePoint = this.server.createList('servicePoint', servicePointAmount);
    this.visit(`/settings/calendar/library-hours/${servicePoint[0].id}`);
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

      it('new period button should be presented', () => {
        expect(calendarSettingsInteractor.exceptionalForm.newPeriod.isPresent).to.be.true;
      });

      describe('new period button click', () => {
        beforeEach(async () => {
          await calendarSettingsInteractor.exceptionalForm.newPeriod.click();
        });

        describe('exceptional period editor', () => {
          it('should be presented', () => {
            expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.isPresent).to.be.true;
          });

          describe('valid from', () => {
            it('should be presented', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.validFrom.isPresent).to.be.true;
            });

            it('should have proper label', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.validFrom.labelText).to.equal(
                getRequiredLabel(translation.validFrom, false)
              );
            });
          });

          describe('valid from', () => {
            it('should be presented', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.validFrom.isPresent).to.be.true;
            });

            it('should have proper label', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.validFrom.labelText).to.equal(
                getRequiredLabel(translation.validFrom, false)
              );
            });
          });

          describe('name', () => {
            it('should be presented', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.name.isPresent).to.be.true;
            });

            it('should have proper label', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.name.label).to.equal(
                getRequiredLabel(translation.name, false)
              );
            });
          });

          describe('service points', () => {
            it('should be presented', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.servicePoints.isPresent).to.be.true;
            });

            it('should have proper title', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.servicePoints.title.text).to.equal(
                translation['settings.openingPeriodEnd']
              );
            });
            describe('select all button', () => {
              it('should be presented', () => {
                expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.servicePoints.selectAllButton.isPresent).to.be.true;
              });

              it('should have proper text', () => {
                expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.servicePoints.selectAllButton.text).to.equal(
                  translation.selectAll
                );
              });
            });

            it('should have proper amount of service points', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.servicePoints.items().length).to.equal(
                servicePointAmount
              );
            });
          });

          describe('closed checkbox', () => {
            it('should be presented', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.closedCheckbox.isPresent).to.be.true;
            });

            it('should have proper label', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.closedCheckbox.text).to.equal(
                translation['settings.closed']
              );
            });

            describe('closed checkbox click', () => {
              beforeEach(async () => {
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.closedCheckbox.clickAndBlur();
              });

              it('all day checkbox should be checked', () => {
                expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.allDay.isChecked).to.be.true;
              });

              it('opening time should not be presented', () => {
                expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.openingTime.isPresent).to.be.false;
              });

              it('closing time should not be presented', () => {
                expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.closingTime.isPresent).to.be.false;
              });
            });
          });

          describe('all day checkbox', () => {
            it('should be presented', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.allDay.isPresent).to.be.true;
            });

            it('should have proper label', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.allDay.text).to.equal(
                translation['settings.allDay']
              );
            });

            describe('all day checkbox click', () => {
              beforeEach(async () => {
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.allDay.clickAndBlur();
              });

              it('opening time should not be presented', () => {
                expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.openingTime.isPresent).to.be.false;
              });

              it('closing time should not be presented', () => {
                expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.closingTime.isPresent).to.be.false;
              });
            });
          });

          describe('opening time', () => {
            it('should be presented', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.openingTime.isPresent).to.be.true;
            });

            it('should have proper label', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.openingTime.labelText).to.equal(
                translation.openingTime
              );
            });
          });

          describe('closing time', () => {
            it('should be presented', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.closingTime.isPresent).to.be.true;
            });

            it('should have proper label', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.closingTime.labelText).to.equal(
                translation.closingTime
              );
            });
          });
        });
      });
    });
  });
});
