import { ConnectedComponentProps } from "@folio/stripes-connect";
import { Dayjs } from "dayjs";
import memoizee from "memoizee";
import { Calendar, DailyOpeningInfo, ServicePoint } from "../types/types";
import { MAX_LIMIT, Resources } from "./SharedData";

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

  /** If enough data has loaded for the app to render */
  isLoaded(): boolean {
    return this.areServicePointsLoaded() && this.areCalendarsLoaded();
  }

  /** If service points have been loaded */
  areServicePointsLoaded(): boolean {
    return this.resources.servicePoints.hasLoaded;
  }

  /** Get all service points */
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

  /** Get an array of service points corresponding to the provided ids */
  getServicePointsFromIds(ids: string[]): ServicePoint[] {
    const map = getServicePointMap(this.getServicePoints());
    return ids
      .map((id): ServicePoint | undefined => map[id])
      .filter((sp): sp is ServicePoint => sp !== undefined);
  }

  /** Get the service point, or undefined, corresponding to the provided id */
  getServicePointsFromId(id?: string): ServicePoint | undefined {
    if (id === undefined) return undefined;
    const map = getServicePointMap(this.getServicePoints());
    return map[id];
  }

  /** Get an array of names corresponding to provided IDs.  Unknown IDs will be excluded */
  getServicePointNamesFromIds(ids: string[]): string[] {
    return this.getServicePointsFromIds(ids).map((sp) => sp.name);
  }

  /** If the calendars have finished loading */
  areCalendarsLoaded(): boolean {
    return this.resources.calendars.hasLoaded;
  }

  /** Gets all the calendars, as an array */
  getCalendars(): Calendar[] {
    if (!this.areCalendarsLoaded()) {
      return [];
    }
    return this.resources.calendars.records;
  }

  /** Get a calendar by ID */
  getCalendar(id: string | null | undefined): Calendar | undefined {
    if (id === undefined || id === null) return undefined;
    return this.getCalendars().filter((calendar) => calendar.id === id)[0];
  }

  /** Create a new calendar */
  createCalendar(calendar: Calendar) {
    this.mutator.dates.reset?.();
    return this.mutator.calendars.POST(calendar);
  }

  /** Update a new calendar */
  updateCalendar(newCalendar: Calendar): Promise<Calendar> {
    this.mutator.dates.reset?.();
    return this.mutator.calendars.PUT(newCalendar);
  }

  /** Delete a given calendar */
  deleteCalendar(calendar: Calendar): Promise<void> {
    this.mutator.dates.reset?.();
    return this.mutator.calendars.DELETE(calendar);
  }

  /** Delete a list of given calendars.  Sends a single request with comma-delimited IDs */
  deleteCalendars(calendars: Calendar[]): Promise<void> {
    // tricks stripes-connect into sending API request with comma-delimited path variable
    // stripes-connect only looks at `id` on calendar so other properties are not needed
    const joinedCalendarIds = calendars.map((c) => c.id).join(",");
    const calendar = { id: joinedCalendarIds } as Calendar;

    this.mutator.dates.reset?.();
    return this.mutator.calendars.DELETE(calendar);
  }

  /**
   * Get dates between a given range.  Service point will be provided by the
   * current route
   */
  getDateRange(startDate: Dayjs, endDate: Dayjs): Promise<DailyOpeningInfo[]> {
    if (this.mutator.dates.GET === undefined) {
      return Promise.resolve([]);
    }
    return this.mutator.dates.GET({
      params: {
        limit: MAX_LIMIT.toString(),
        includeClosed: "true",
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
      },
    });
  }
}
