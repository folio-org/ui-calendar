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

@interactor class NextPeriod {
  static defaultScope = '[data-test-service-point-next-period]';

  header = scoped('[data-test-next-period-header]');
  list = collection('[data-test-next-period-item]');
}

@interactor class CurrentPeriodTimes {
  static defaultScope = '[data-test-service-point-current-period-times]';

  sunday = scoped('[data-test-sunday]', KeyValue);
  monday = scoped('[data-test-monday]', KeyValue);
  tuesday = scoped('[data-test-tuesday]', KeyValue);
  wednesday = scoped('[data-test-wednesday]', KeyValue);
  thursday = scoped('[data-test-thursday]', KeyValue);
  friday = scoped('[data-test-friday]', KeyValue);
  saturday = scoped('[data-test-saturday]', KeyValue);
}

@interactor class ServicePointDetails {
  static defaultScope = 'div[class^="paneset--"] div[class^="paneset--"] > section[class^="pane--"]:nth-child(2)';

  title = scoped('[class^="paneTitleLabel--"]');
  name = new KeyValue('[data-test-service-point-name]');
  code = new KeyValue('[data-test-service-point-code]');
  discoveryDisplayName= new KeyValue('[data-test-service-point-discovery-display-name]');

  regularLibraryHours = scoped('[data-test-service-point-regular-library-hours]');
  currentPeriod = scoped('[data-test-service-point-current-period]', KeyValue);
  currentPeriodTimes = new CurrentPeriodTimes();
  nextPeriod = new NextPeriod();
  newPeriodButton = scoped('[data-test-new-period]');
  clonePeriodButton = scoped('[data-test-clone-settings]');
  isclonePeriodButtonDisabled = property('[data-test-clone-settings]', 'disabled');
  actualLibraryHours = scoped('[data-test-actual-library-hours]');
  actualLibraryHoursHeader = scoped('[data-test-actual-library-hours-header]');
  regularOpeningHoursWithExceptions = scoped('[data-test-regular-opening-hours-with-exceptions]');
  addExeptionsButton = scoped('[ data-test-add-exeptions]');
  closeButton = scoped('div[class^="paneHeaderButtonsArea--"] button')
}

export default @interactor class CalendarSettingsInteractor {
  static defaultScope = '#ModuleContainer';

  allSettings = new SettingsPane('div[class^="paneset--"] > section[class^="pane--"]:nth-child(1)');
  calendarSettings = new SettingsPane('div[class^="paneset--"] > section[class^="pane--"]:nth-child(2)');
  libraryHoursSettings = new SettingsPane('div[class^="paneset--"] div[class^="paneset--"] > section[class^="pane--"]:nth-child(1)');
  servicePointDetails = new ServicePointDetails();
  openingPeriodForm = scoped('[data-test-opening-period-form]');
  newPeriodForm = scoped('[data-test-new-period-form]');
  exceptionalForm = scoped('[data-test-exceptional-form]');
}
