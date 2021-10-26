import {
  interactor,
  scoped,
  Interactor,
  collection,
  isPresent,
} from '@bigtest/interactor';

// eslint-disable-next-line
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
// eslint-disable-next-line
import CheckboxInteractor from '@folio/stripes-components/lib/Checkbox/tests/interactor';
// eslint-disable-next-line
import DatepickerInteractor from '@folio/stripes-components/lib/Datepicker/tests/interactor';
// eslint-disable-next-line
import TimepickerInteractor from '@folio/stripes-components/lib/Timepicker/tests/interactor';
import BigCalendar from './BigCalendar';
import ConfirmationModal from './ConfirmationModal';

@interactor class ServicePointSelector {
  defaultScope = '[data-test-service-point-selector]';

  items = collection('[data-test-service-point]', CheckboxInteractor);

  isLoaded = isPresent('[data-test-service-point-selector]');

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }
}

@interactor class ServicePoints {
  defaultScope = '[data-test-service-points]';

  label = scoped('[data-test-service-points-label]');
  selectAllButton = scoped('[data-test-select-all]');
  items = collection('[data-test-service-point]', CheckboxInteractor);
}

@interactor class ExceptionalPeriodEditor {
  defaultScope = '[data-test-exceptional-period-editor]';

  savePeriod = new Interactor('[data-test-save-exceptional-period]');
  validFrom = new DatepickerInteractor('[data-test-start-date]');
  validTo = new DatepickerInteractor('[data-test-end-date]');
  name = new TextFieldInteractor('[data-test-period-name]');
  servicePoints = new ServicePoints();
  closedCheckbox = scoped('[data-test-closed]', CheckboxInteractor);
  allDay = scoped('[data-test-all-day]', CheckboxInteractor);
  openingTime = scoped('[data-test-opening-time]', TimepickerInteractor);
  closingTime = scoped('[data-test-closing-time]', TimepickerInteractor);
}

export default @interactor class ExeptionalForm {
  defaultScope = '[data-test-exceptional-form]';

  newPeriod = new Interactor('[data-test-exceptional-new-period-button]');
  closeButton = new Interactor('[data-test-close-button]');
  exceptionalPeriodEditor = new ExceptionalPeriodEditor();
  servicePointSelector = new ServicePointSelector();
  bigCalendar = new BigCalendar();
  exiteConfirmationModal = new ConfirmationModal('#exite-confirmation');
  errorModal = new ConfirmationModal('[data-test-error-modal]');
  cancelEditing = new Interactor('[data-test-cancel-exception-form]');
}
