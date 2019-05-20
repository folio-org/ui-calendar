import {
  interactor,
  scoped,
  Interactor,
} from '@bigtest/interactor';

export default @interactor class ExeptionalForm {
  defaultScope = '[data-test-exceptional-form]';

  newPeriod = new Interactor('[data-test-exceptional-new-period-button]');
  exceptionalPeriodEditor = scoped('[data-test-exceptional-period-editor]')
}
