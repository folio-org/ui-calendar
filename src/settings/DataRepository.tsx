import { ConnectedComponentProps } from "@folio/stripes-connect";
import { Calendar, ServicePoint } from "../types/types";
import { Resources } from "./SharedData";

export default class DataRepository {
  private resources: ConnectedComponentProps<Resources>["resources"];
  private mutator: ConnectedComponentProps<Resources>["mutator"];

  constructor(
    resources: ConnectedComponentProps<Resources>["resources"],
    mutator: ConnectedComponentProps<Resources>["mutator"]
  ) {
    this.resources = resources;
    this.resources.servicePoints.records.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    this.mutator = mutator;
  }

  isLoaded(): boolean {
    return this.areServicePointsLoaded() && this.areCalendarsLoaded();
  }

  areServicePointsLoaded(): boolean {
    return this.resources.servicePoints.hasLoaded;
  }

  getServicePoints(): ServicePoint[] {
    if (!this.areServicePointsLoaded()) {
      return [];
    }
    return this.resources.servicePoints.records.map((dto) => ({
      id: dto.id,
      name: dto.name,
      inactive: false,
    }));
  }

  areCalendarsLoaded(): boolean {
    return this.resources.calendars.hasLoaded;
  }

  getCalendars(): Calendar[] {
    if (!this.areCalendarsLoaded()) {
      return [];
    }
    return this.resources.calendars.records;
  }
}
