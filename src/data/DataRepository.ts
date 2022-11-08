import memoizee from 'memoizee';
import {
  Calendar,
  CalendarDTO,
  DailyOpeningInfo,
  ServicePoint,
  User
} from '../types/types';
import { dateUTCToYYYYMMDD } from '../utils/DateUtils';
import { ServicePointDTO } from './types';

const getServicePointMap = memoizee(
  (servicePoints: ServicePoint[]): Record<string, ServicePoint> => {
    const map: Record<string, ServicePoint> = {};
    servicePoints.forEach((sp) => {
      map[sp.id] = sp;
    });
    return map;
  }
);

interface MutatorsType {
  create: (calendar: Calendar) => Promise<CalendarDTO>;
  update: (calendar: Calendar) => Promise<CalendarDTO>;
  delete: (calendars: Calendar[]) => Promise<void>;
  dates: (params: {
    servicePointId: string;
    startDate: string;
    endDate: string;
  }) => Promise<DailyOpeningInfo[]>;
  getUser: (params: { userId: string; signal?: AbortSignal }) => Promise<User>;
}

export default class DataRepository {
  calendarsLoaded: boolean;
  calendars: CalendarDTO[];

  servicePointsLoaded: boolean;
  servicePoints: ServicePointDTO[];

  mutators: MutatorsType;

  constructor(
    calendars: CalendarDTO[] | undefined,
    servicePoints: ServicePointDTO[] | undefined,
    mutators: MutatorsType
  ) {
    this.calendarsLoaded = calendars !== undefined;
    this.calendars = calendars ?? [];

    this.servicePointsLoaded = servicePoints !== undefined;
    this.servicePoints = servicePoints ?? [];

    this.mutators = mutators;
  }

  /** If enough data has loaded for the app to render */
  isLoaded(): boolean {
    return this.areServicePointsLoaded() && this.areCalendarsLoaded();
  }

  /** If service points have been loaded */
  areServicePointsLoaded(): boolean {
    return this.servicePointsLoaded;
  }

  /** Get all service points */
  getServicePoints(): ServicePoint[] {
    if (!this.areServicePointsLoaded()) {
      return [];
    }
    return this.servicePoints.map((dto) => ({
      id: dto.id,
      name: dto.name,
      inactive: false
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
  getServicePointFromId(id?: string): ServicePoint | undefined {
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
    return this.calendarsLoaded;
  }

  /** Gets all the calendars, as an array */
  getCalendars(): CalendarDTO[] {
    if (!this.areCalendarsLoaded()) {
      return [];
    }
    return this.calendars;
  }

  /** Get a calendar by ID */
  getCalendar(id: string | null | undefined): CalendarDTO | undefined {
    if (id === undefined || id === null) return undefined;
    return this.getCalendars().filter((calendar) => calendar.id === id)[0];
  }

  /** Create a new calendar */
  createCalendar(calendar: Calendar): Promise<CalendarDTO> {
    return this.mutators.create(calendar);
  }

  /** Update a new calendar */
  updateCalendar(newCalendar: Calendar): Promise<CalendarDTO> {
    return this.mutators.update(newCalendar);
  }

  /** Delete a given calendar */
  deleteCalendar(calendar: Calendar): Promise<void> {
    return this.mutators.delete([calendar]);
  }

  /** Delete a list of given calendars.  Sends a single request with comma-delimited IDs */
  deleteCalendars(calendars: Calendar[]): Promise<void> {
    return this.mutators.delete(calendars);
  }

  /**
   * Get dates between a given range.  Service point will be provided by the
   * current route
   */
  getDailyOpeningInfo(
    servicePointId: string,
    startDate: Date,
    endDate: Date
  ): Promise<DailyOpeningInfo[]> {
    return this.mutators.dates({
      servicePointId,
      startDate: dateUTCToYYYYMMDD(startDate),
      endDate: dateUTCToYYYYMMDD(endDate)
    });
  }

  /**
   * Get a user by ID.  Optionally, requests may be aborted when the data is no longer needed
   * Errors will NOT be rejected, instead, a never-resolving promise will be returned
   */
  getUser(userId: string, signal?: AbortSignal): Promise<User> {
    return this.mutators.getUser({ userId, signal });
  }
}
