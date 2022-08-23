import { ConnectedComponentProps } from '@folio/stripes-connect';
import { useEffect, useState } from 'react';
import DataRepository from './DataRepository';
import { Resources } from './SharedData';

/**
 * Hook to include a data repository in the given component.  The data
 * repository will be completely changed when additional resources or mutations
 * become available
 */
export default function useDataRepository(
  resources: ConnectedComponentProps<Resources>['resources'],
  mutator: ConnectedComponentProps<Resources>['mutator']
): DataRepository {
  const [dataRepository, setDataRepository] = useState(
    new DataRepository(resources, mutator)
  );

  useEffect(
    () => setDataRepository(new DataRepository(resources, mutator)),
    [resources, mutator]
  );

  return dataRepository;
}
