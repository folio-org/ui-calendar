import {
  interactor,
  scoped,
  collection,
  property,
} from '@bigtest/interactor';

import KeyValue from './KeyValue';

@interactor class SettingsPane {
  title = scoped('[class^="paneTitleLabel--"]');
  items = collection('[data-test-nav-list] a');
}
@interactor class ServicePointDetails {
  static defaultScope = 'div[class^="paneset--"] div[class^="paneset--"] > section[class^="pane--"]:nth-child(2)';

  title = scoped('[class^="paneTitleLabel--"]');
  name = new KeyValue('[data-test-service-point-name]');
  code = new KeyValue('[data-test-service-point-code]');
  discoveryDisplayName= new KeyValue('[data-test-service-point-discovery-display-name]');

  regularLibraryHours = scoped('[data-test-service-point-regular-library-hours]');
  currentPeriod = scoped('[data-test-service-point-current-period]', KeyValue);
  currentPeriodTimes = scoped('[data-test-service-point-current-period-times]');
  nextPeriod= scoped('[data-test-service-point-next-period]');
  newPeriodButton= scoped('[data-test-new-period]');
  clonePeriodButton= scoped('[data-test-clone-settings]');
  isclonePeriodButtonDisabled = property('[data-test-clone-settings]', 'disabled');
  actualLibraryHours= scoped('[data-test-actual-library-hours]');
  actualLibraryHoursHeader= scoped('[data-test-actual-library-hours-header]');
  regularOpeningHoursWithExceptions= scoped('[data-test-regular-opening-hours-with-exceptions]');
  addExeptionsButton= scoped('[ data-test-add-exeptions]');
}

export default @interactor class CalendarSettingsInteractor {
  static defaultScope = '#ModuleContainer';

  allSettings = new SettingsPane('div[class^="paneset--"] > section[class^="pane--"]:nth-child(1)');
  calendarSettings = new SettingsPane('div[class^="paneset--"] > section[class^="pane--"]:nth-child(2)');
  libraryHoursSettings = new SettingsPane('div[class^="paneset--"] div[class^="paneset--"] > section[class^="pane--"]:nth-child(1)');
  servicePointDetails = new ServicePointDetails();
  openingPeriodForm = scoped('[data-test-opening-period-form]');
  exceptionalForm = scoped('[data-test-exceptional-form]');
}
