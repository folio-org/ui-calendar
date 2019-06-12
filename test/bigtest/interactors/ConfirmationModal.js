import {
  interactor,
  scoped,
} from '@bigtest/interactor';

export default @interactor class ConfirmationModal {
  header = scoped('[class^="modalHeader--"]');
  modalContent = scoped('[class^="modalContent"]');
  confirmButton = scoped('[data-test-confirmation-modal-confirm-button]');
  cancelButton = scoped('[data-test-confirmation-modal-cancel-button]');
  closeButton = scoped('[data-test-close-button]');
}
