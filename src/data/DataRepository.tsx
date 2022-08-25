import type { Dayjs } from 'dayjs';
import memoizee from 'memoizee';
import { Calendar, DailyOpeningInfo, ServicePoint } from '../types/types';
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
  create: (calendar: Calendar) => Promise<Calendar>;
  update: (calendar: Calendar) => Promise<Calendar>;
  delete: (calendars: Calendar[]) => Promise<void>;
  dates: (params: {
    servicePointId: string;
    startDate: string;
    endDate: string;
  }) => Promise<DailyOpeningInfo[]>;
}

export default class DataRepository {
  calendarsLoaded: boolean;
  calendars: Calendar[];

  servicePointsLoaded: boolean;
  servicePoints: ServicePointDTO[];

  mutators: MutatorsType;

  constructor(
    calendars: Calendar[] | undefined,
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
    return this.calendarsLoaded;
  }

  /** Gets all the calendars, as an array */
  getCalendars(): Calendar[] {
    if (!this.areCalendarsLoaded()) {
      return [];
    }
    return this.calendars;
  }

  /** Get a calendar by ID */
  getCalendar(id: string | null | undefined): Calendar | undefined {
    if (id === undefined || id === null) return undefined;
    return this.getCalendars().filter((calendar) => calendar.id === id)[0];
  }

  /** Create a new calendar */
  async createCalendar(calendar: Calendar): Promise<Calendar> {
    return this.mutators.create(calendar);
  }

  /** Update a new calendar */
  updateCalendar(newCalendar: Calendar): Promise<Calendar> {
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
    startDate: Dayjs,
    endDate: Dayjs
  ): Promise<DailyOpeningInfo[]> {
    return this.mutators.dates({
      servicePointId,
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
    });
  }
}