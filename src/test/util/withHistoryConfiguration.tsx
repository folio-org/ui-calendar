import { createMemoryHistory } from 'history';
import React, { ReactNode } from 'react';
import { Router } from 'react-router-dom';

function withHistoryConfiguration(children: ReactNode): JSX.Element {
  const history = createMemoryHistory();

  return <Router history={history}>{children}</Router>;
}

export default withHistoryConfiguration;
