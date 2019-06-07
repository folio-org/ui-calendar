import {
  interactor,
  scoped,
  Interactor,
  collection,
} from '@bigtest/interactor';

// eslint-disable-next-line
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
// eslint-disable-next-line
import CheckboxInteractor from '@folio/stripes-components/lib/Checkbox/tests/interactor';
// eslint-disable-next-line
import DatepickerInteractor from '@folio/stripes-components/lib/Datepicker/tests/interactor';
import BigCalendar from './BigCalendar';

@interactor class ServicePointSelector {
  defaultScope = '[data-test-service-point-selector]';

  items = collection('[data-test-service-point]', CheckboxInteractor);
}

@interactor class ServicePoints {
  defaultScope = '[data-test-service-points]';

  title = scoped('[data-test-service-points-title]');
  selectAllButton = scoped('[data-test-select-all]');
  items = collection('[data-test-service-point]', CheckboxInteractor);
}

@interactor class ExceptionalPeriodEditor {
  defaultScope = '[data-test-exceptional-period-editor]';

  savePeriod = new Interactor('[data-test-save-exceptional-period]');
  validFrom = scoped('[data-test-start-date]', DatepickerInteractor);
  validTo = scoped('[data-test-end-date]', DatepickerInteractor);
  name = scoped('[data-test-period-name]', TextFieldInteractor);
  servicePoints = new ServicePoints();
  closedCheckbox = scoped('[data-test-closed]', CheckboxInteractor);
  allDay = scoped('[data-test-all-day]', CheckboxInteractor);
  openingTime = scoped('[data-test-opening-time]', DatepickerInteractor);
  closingTime = scoped('[data-test-closing-time]', DatepickerInteractor);
}

export default @interactor class ExeptionalForm {
  defaultScope = '[data-test-exceptional-form]';

  newPeriod = new Interactor('[data-test-exceptional-new-period-button]');
  exceptionalPeriodEditor = new ExceptionalPeriodEditor();
  servicePointSelector = new ServicePointSelector();
  bigCalendar = new BigCalendar();
}
