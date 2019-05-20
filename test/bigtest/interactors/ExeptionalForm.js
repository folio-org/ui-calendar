import {
  interactor,
  scoped,
  Interactor,
} from '@bigtest/interactor';

import ConfirmationModal from './ConfirmationModal';

export default @interactor class ExeptionalForm {
  defaultScope = '[data-test-exceptional-form]';

  exiteConfirmationModal = new ConfirmationModal('#exite-confirmation');

  newPeriod = new Interactor('[data-test-exceptional-new-period-button]');
  exceptionalPeriodEditor = scoped('[data-test-exceptional-period-editor]')
}
