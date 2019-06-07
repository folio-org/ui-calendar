import {
  interactor,
  property,
  scoped,
} from '@bigtest/interactor';
// eslint-disable-next-line
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
// eslint-disable-next-line
import DatepickerInteractor from '@folio/stripes-components/lib/Datepicker/tests/interactor';

import BigCalendar from './BigCalendar';

@interactor class ErrorModal {
  defaultScope = '#error-modal';

  content = scoped('[data-test-error-modal-content]');
  closeButton = scoped('[data-test-error-modal-close-button]');
}

@interactor class ConfirmationModal {
  header = scoped('[class^="modalHeader--"]');
  modalContent = scoped('[class^="modalContent"]');
  confirmButton = scoped('[data-test-confirmation-modal-confirm-button]');
  cancelButton = scoped('[data-test-confirmation-modal-cancel-button]');
}

@interactor class FormHeader {
  defaultScope = '[data-test-opening-period-form-header]';

  title = scoped('[data-test-title]');
  saveButton = scoped('[data-test-save-button]');
  deleteButton = scoped('[data-test-delete-button]');
  closeButton = scoped('[data-test-close-button] button');
  saveAsTemlateButton = scoped('[data-test-save-as-template]');

  isSaveButtonDisabled = property('[data-test-save-button]', 'disabled');
  isDeleteButtonDisabled = property('[data-test-delete-button]', 'disabled');
  isCloseButtonDisabled = property('[data-test-close-button] button', 'disabled');
  isSaveAsTemlateButtonDisabled = property('[data-test-save-as-template]', 'disabled');
}

@interactor class InputFields {
  defaultScope = '[data-test-input-fields]';

  startDate = scoped('[data-test-item-start-date]', DatepickerInteractor);
  endDate = scoped('[data-test-item-end-date]', DatepickerInteractor);
  periodName = scoped('[data-test-item-period-name]', TextFieldInteractor);
  periodNameError = scoped('[data-test-item-period-name-error]');
}

@interactor class BigCalendarHeader {
  defaultScope = '[data-test-big-calendar-header]';

  hedline = scoped('[data-test-big-calendar-header-hedline]');
  copyButton = scoped('[data-test-copy]');
  selectTemplateButton = scoped('[data-test-select-template]');

  isCopyButtonDisabled = property('[data-test-copy]', 'disabled');
  isSelectTemplateButtonDisabled = property('[data-test-save-as-template]', 'disabled');
}

export default @interactor class OpeningPeriodForm {
  static defaultScope = '[data-test-opening-period-form]';

  formHeader = new FormHeader();
  inputFields = new InputFields();
  bigCalendarHeader = new BigCalendarHeader();
  bigCalendar = new BigCalendar();

  deleteConfirmationModal = new ConfirmationModal('#delete-confirmation');
  exiteConfirmationModal = new ConfirmationModal('#exite-confirmation');
  errorModal = new ErrorModal();
}
