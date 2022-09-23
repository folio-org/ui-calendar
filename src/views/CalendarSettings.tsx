import { ErrorBoundary } from '@folio/stripes/components';
import type { SettingsProps } from '@folio/stripes/smart-components';
import { Settings } from '@folio/stripes/smart-components';
import type { FunctionComponent } from 'react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import AllCalendarView from './AllCalendarView';
import CurrentAssignmentView from './CurrentAssignmentView';
import MonthlyCalendarPickerView from './MonthlyCalendarPickerView';

export type CalendarSettingsProps = SettingsProps;

export const CalendarSettings: FunctionComponent<CalendarSettingsProps> = (
  props: CalendarSettingsProps
) => {
  return (
    <ErrorBoundary>
      <Settings
        {...props}
        navPaneWidth="30%"
        pages={[
          {
            route: 'all/',
            label: <FormattedMessage id="ui-calendar.allCalendarView.title" />,
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
