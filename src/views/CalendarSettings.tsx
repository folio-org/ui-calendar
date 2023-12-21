import { ErrorBoundary } from '@folio/stripes/components';
import { Settings, SettingsProps } from '@folio/stripes/smart-components';
import React, { FunctionComponent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  FooBar as TitleManager,
  IfPermission,
  useStripes,
} from '@folio/stripes/core';
import AllCalendarView from './AllCalendarView';
import CurrentAssignmentView from './CurrentAssignmentView';
import MonthlyCalendarPickerView from './MonthlyCalendarPickerView';

export type CalendarSettingsProps = Omit<
  SettingsProps,
  'navPaneWidth' | 'pages' | 'paneTitle'
>;

export const CalendarSettings: FunctionComponent<CalendarSettingsProps> = (
  props: CalendarSettingsProps,
) => {
  const intl = useIntl();
  const stripes = useStripes();
  const paneTitle = intl.formatMessage({
    id: 'ui-calendar.meta.titleSettings',
  });

  return (
    <ErrorBoundary>
      <IfPermission perm="foo">bar</IfPermission>
      <Settings
        {...props}
        navPaneWidth="30%"
        pages={[
          {
            route: 'all/',
            label: (
              <TitleManager page={paneTitle} stripes={stripes}>
                <FormattedMessage id="ui-calendar.allCalendarView.title" />
              </TitleManager>
            ),
            component: AllCalendarView,
            perm: 'ui-calendar.view',
          },
          {
            route: 'active/',
            label: (
              <FormattedMessage id="ui-calendar.currentAssignmentView.title" />
            ),
            component: CurrentAssignmentView,
            perm: 'ui-calendar.view',
          },
          {
            route: 'monthly/',
            label: (
              <FormattedMessage id="ui-calendar.monthlyCalendarView.title" />
            ),
            component: MonthlyCalendarPickerView,
            perm: 'ui-calendar.view',
          },
        ]}
        paneTitle={<FormattedMessage id="ui-calendar.meta.title" />}
      />
    </ErrorBoundary>
  );
};

export default CalendarSettings;
