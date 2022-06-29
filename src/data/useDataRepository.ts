import { ConnectedComponentProps } from "@folio/stripes-connect";
import { useEffect, useState } from "react";
import DataRepository from "./DataRepository";
import { Resources } from "./SharedData";

export default function useDataRepository(
  resources: ConnectedComponentProps<Resources>["resources"],
  mutator: ConnectedComponentProps<Resources>["mutator"]
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
