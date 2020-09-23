import {
  interactor,
  scoped,
  collection,
} from '@bigtest/interactor';

import ServicePointDetails from './ServicePointDetails';
import OpeningPeriodForm from './OpeningPeriodForm';
import ExeptionalForm from './ExeptionalForm';

@interactor class SettingsPane {
  title = scoped('[class^="paneTitleLabel--"]');
  items = collection('[data-test-nav-list] a');
}

export default @interactor class CalendarSettingsInteractor {
  static defaultScope = '#ModuleContainer';

  allSettings = new SettingsPane('div[class^="paneset--"] > section[class^="pane--"]:nth-child(1)');
  calendarSettings = new SettingsPane('div[class^="paneset--"] > section[class^="pane--"]:nth-child(2)');
  libraryHoursSettings = new SettingsPane('div[class^="paneset--"] div[class^="paneset--"] > section[class^="pane--"]:nth-child(1)');
  servicePointDetails = new ServicePointDetails();
  openingPeriodForm = new OpeningPeriodForm();
  exceptionalForm = new ExeptionalForm();

  whenLoaded() {
    return this.when(() => this.isPresent).timeout(5000);
  }
}
