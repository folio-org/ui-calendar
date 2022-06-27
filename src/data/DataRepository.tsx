import { ConnectedComponentProps } from "@folio/stripes-connect";
import memoizee from "memoizee";
import { Calendar, ServicePoint } from "../types/types";
import { Resources } from "./SharedData";

const getServicePointMap = memoizee(
  (servicePoints: ServicePoint[]): Record<string, ServicePoint> => {
    const map: Record<string, ServicePoint> = {};
    servicePoints.forEach((sp) => {
      map[sp.id] = sp;
    });
    return map;
  }
);

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

  getServicePointsFromIds(ids: string[]): ServicePoint[] {
    const map = getServicePointMap(this.getServicePoints());
    return ids
      .map((id): ServicePoint | undefined => map[id])
      .filter((sp): sp is ServicePoint => sp !== undefined);
  }

  getServicePointNamesFromIds(ids: string[]): string[] {
    const map = getServicePointMap(this.getServicePoints());
    return ids
      .map((id): ServicePoint | undefined => map[id])
      .filter((sp): sp is ServicePoint => sp !== undefined)
      .map((sp) => sp.name);
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

  createCalendar(calendar: Calendar) {
    return this.mutator.calendars.POST(calendar);
  }
}
