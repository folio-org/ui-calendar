import {
  collection,
  interactor,
  scoped,
} from '@bigtest/interactor';

import KeyValue from './KeyValue';

@interactor class NextPeriodItem {
  label = scoped('[data-test-next-period-item-label]');
  editButton = scoped('[data-test-next-period-item-edit-button]');
}

@interactor class NextPeriod {
  static defaultScope = '[data-test-service-point-next-period]';

  header = scoped('[data-test-next-period-header]');
  list = collection('[data-test-next-period-item]', NextPeriodItem);
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

export default @interactor class ServicePointDetails {
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
  actualLibraryHours = scoped('[data-test-actual-library-hours]');
  actualLibraryHoursHeader = scoped('[data-test-actual-library-hours-header]');
  regularOpeningHoursWithExceptions = scoped('[data-test-regular-opening-hours-with-exceptions]');
  addExeptionsButton = scoped('[data-test-add-exeptions]');
  closeButton = scoped('div[class^="paneHeaderButtonsArea--"] button')
}
