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
import {
  endDate,
  name,
  startDatePast,
  startTime,
} from '../constants';

describe('open exceptional form', () => {
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

          describe('valid to', () => {
            it('should be presented', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.validTo.isPresent).to.be.true;
            });

            it('should have proper label', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.validTo.labelText).to.equal(
                getRequiredLabel(translation.validTo, false)
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

            it('should have proper label', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.servicePoints.label.text).to.equal(
                getRequiredLabel(translation['settings.openingPeriodEnd'], false)
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

              describe('select all button click', () => {
                beforeEach(async () => {
                  await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.servicePoints.selectAllButton.click();
                });

                it('should have proper text', () => {
                  expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.servicePoints.selectAllButton.text).to.equal(
                    translation.deselectAll
                  );
                });

                describe('select all button click', () => {
                  beforeEach(async () => {
                    await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.servicePoints.selectAllButton.click();
                  });

                  it('should have proper text', () => {
                    expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.servicePoints.selectAllButton.text).to.equal(
                      translation.selectAll
                    );
                  });
                });
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
              expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.openingTime.text).to.equal(
                translation.openingTime
              );
            });
          });

          describe('closing time', () => {
            it('should be presented', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.closingTime.isPresent).to.be.true;
            });

            it('should have proper label', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.closingTime.text).to.equal(
                translation.closingTime
              );
            });
          });

          describe('exit confirmation modal', () => {
            beforeEach(async () => {
              await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.allDay.clickAndBlur();
              await calendarSettingsInteractor.exceptionalForm.cancelEditing.click();
            });

            it('should be displayed', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exiteConfirmationModal.isPresent).to.be.true;
            });

            it('should have proper text', () => {
              expect(calendarSettingsInteractor.exceptionalForm.exiteConfirmationModal.modalContent.text).to.equal(
                translation.exitQuestionMessage
              );
            });

            describe('cancel button', () => {
              it('should be displayed', () => {
                expect(calendarSettingsInteractor.exceptionalForm.exiteConfirmationModal.cancelButton.isPresent).to.be.true;
              });

              describe('cancel button click', () => {
                beforeEach(async () => {
                  await calendarSettingsInteractor.exceptionalForm.exiteConfirmationModal.cancelButton.click();
                });

                it('exit confirmation modal should not be displayed', () => {
                  expect(calendarSettingsInteractor.exceptionalForm.exiteConfirmationModal.isPresent).to.be.false;
                });

                it('exceptional period form should be displayed', () => {
                  expect(calendarSettingsInteractor.exceptionalForm.isPresent).to.be.true;
                });
              });
            });

            describe('confirm button', () => {
              it('should be displayed', () => {
                expect(calendarSettingsInteractor.exceptionalForm.exiteConfirmationModal.confirmButton.isPresent).to.be.true;
              });

              describe('confirm button click', () => {
                beforeEach(async () => {
                  await calendarSettingsInteractor.exceptionalForm.exiteConfirmationModal.confirmButton.click();
                });

                it('service point details should be displayed', () => {
                  expect(calendarSettingsInteractor.servicePointDetails.isPresent).to.be.true;
                });
              });
            });
          });

          describe('error modal modal', () => {
            describe('no start date error', () => {
              beforeEach(async () => {
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.savePeriod.click();
              });

              it('should be displayed', () => {
                expect(calendarSettingsInteractor.exceptionalForm.errorModal.isPresent).to.be.true;
              });

              it('should have proper text', () => {
                expect(calendarSettingsInteractor.exceptionalForm.errorModal.modalContent.text).to.equal(
                  translation.noStartDate
                );
              });

              describe('cancel button', () => {
                it('should be displayed', () => {
                  expect(calendarSettingsInteractor.exceptionalForm.errorModal.closeButton.isPresent).to.be.true;
                });

                describe('cancel button click', () => {
                  beforeEach(async () => {
                    await calendarSettingsInteractor.exceptionalForm.errorModal.closeButton.click();
                  });

                  it('exit confirmation modal should not be displayed', () => {
                    expect(calendarSettingsInteractor.exceptionalForm.errorModal.isPresent).to.be.false;
                  });

                  it('exceptional period form should be displayed', () => {
                    expect(calendarSettingsInteractor.exceptionalForm.isPresent).to.be.true;
                  });
                });
              });
            });

            describe('no end date error', () => {
              beforeEach(async () => {
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.validFrom.fillAndBlur(startDatePast);
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.savePeriod.click();
              });

              it('should be displayed', () => {
                expect(calendarSettingsInteractor.exceptionalForm.errorModal.isPresent).to.be.true;
              });

              it('should have proper text', () => {
                expect(calendarSettingsInteractor.exceptionalForm.errorModal.modalContent.text).to.equal(
                  translation.noEndDate
                );
              });
            });

            describe('wrong start end date error', () => {
              beforeEach(async () => {
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.validFrom.fillAndBlur(endDate);
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.validTo.fillAndBlur(startDatePast);
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.savePeriod.click();
              });

              it('should be displayed', () => {
                expect(calendarSettingsInteractor.exceptionalForm.errorModal.isPresent).to.be.true;
              });

              it('should have proper text', () => {
                expect(calendarSettingsInteractor.exceptionalForm.errorModal.modalContent.text).to.equal(
                  translation.wrongStartEndDate
                );
              });
            });

            describe('no name error', () => {
              beforeEach(async () => {
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.validFrom.fillAndBlur(startDatePast);
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.validTo.fillAndBlur(endDate);
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.savePeriod.click();
              });

              it('should be displayed', () => {
                expect(calendarSettingsInteractor.exceptionalForm.errorModal.isPresent).to.be.true;
              });

              it('should have proper text', () => {
                expect(calendarSettingsInteractor.exceptionalForm.errorModal.modalContent.text).to.equal(
                  translation.noName
                );
              });
            });


            describe('no service point selected error', () => {
              beforeEach(async () => {
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.validFrom.fillAndBlur(startDatePast);
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.validTo.fillAndBlur(endDate);
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.name.fillAndBlur(name);
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.savePeriod.click();
              });

              it('should be displayed', () => {
                expect(calendarSettingsInteractor.exceptionalForm.errorModal.isPresent).to.be.true;
              });

              it('should have proper text', () => {
                expect(calendarSettingsInteractor.exceptionalForm.errorModal.modalContent.text).to.equal(
                  translation.noServicePointSelected
                );
              });
            });

            describe('no start time error', () => {
              beforeEach(async () => {
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.validFrom.fillAndBlur(startDatePast);
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.validTo.fillAndBlur(endDate);
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.name.fillAndBlur(name);
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.servicePoints.items(0).clickAndBlur();
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.savePeriod.click();
              });

              it('should be displayed', () => {
                expect(calendarSettingsInteractor.exceptionalForm.errorModal.isPresent).to.be.true;
              });

              it('should have proper text', () => {
                expect(calendarSettingsInteractor.exceptionalForm.errorModal.modalContent.text).to.equal(
                  translation.noStartTime
                );
              });
            });

            describe('no end time error', () => {
              beforeEach(async () => {
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.validFrom.fillAndBlur(startDatePast);
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.validTo.fillAndBlur(endDate);
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.name.fillAndBlur(name);
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.servicePoints.items(0).clickAndBlur();
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.openingTime.fillInput(startTime);
                await calendarSettingsInteractor.exceptionalForm.exceptionalPeriodEditor.savePeriod.click();
              });

              it('should be displayed', () => {
                expect(calendarSettingsInteractor.exceptionalForm.errorModal.isPresent).to.be.true;
              });

              it('should have proper text', () => {
                expect(calendarSettingsInteractor.exceptionalForm.errorModal.modalContent.text).to.equal(
                  translation.noEndTime
                );
              });
            });
          });
        });
      });
    });
  });
});
