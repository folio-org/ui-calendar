import {
  interactor,
  property,
  scoped,
  text,
} from '@bigtest/interactor';

// eslint-disable-next-line
import DatepickerInteractor from '@folio/stripes-components/lib/Datepicker/tests/interactor';

import TextFieldInteractor from './TextField';
import ConfirmationModal from './ConfirmationModal';
import BigCalendar from './BigCalendar';

@interactor class ErrorModal {
  defaultScope = '#error-modal';

  content = scoped('[data-test-error-modal-content] p');
  closeButton = scoped('[data-test-error-modal-close-button]');
}

@interactor class FormHeader {
  defaultScope = '[data-test-opening-period-form-header]';

  title = scoped('[data-test-title]');
  saveButton = scoped('[data-test-save-button]');
  deleteButton = scoped('[data-test-delete-button]');
  closeButton = scoped('[data-test-close-button] button');

  isSaveButtonDisabled = property('[data-test-save-button]', 'disabled');
  isDeleteButtonDisabled = property('[data-test-delete-button]', 'disabled');
  isCloseButtonDisabled = property('[data-test-close-button] button', 'disabled');
}

@interactor class InputFields {
  defaultScope = '[data-test-input-fields]';

  startDate = new DatepickerInteractor('[data-test-item-start-date]');
  endDate = new DatepickerInteractor('[data-test-item-end-date]');
  startDateField = new DatepickerInteractor('[data-test-item-start-date]');
  endDateField = new DatepickerInteractor('[data-test-item-end-date]');
  periodName = new TextFieldInteractor('[data-test-item-period-name] input');
  periodNameLabel = text('[data-test-item-period-name] label');
  periodNameError = scoped('[data-test-item-period-name-error]');
}

@interactor class BigCalendarHeader {
  defaultScope = '[data-test-big-calendar-header]';

  hedline = scoped('[data-test-big-calendar-header-hedline]');
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
