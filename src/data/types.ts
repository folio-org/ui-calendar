import type { CalendarDTO, DailyOpeningInfo } from '../types/types';

export interface ServicePointDTO {
  id: string;
  name: string;
  code: string;
  discoveryDisplayName: string;
  staffSlips: unknown[];
  metadata: unknown;
}

export interface ServicePointResponseDTO {
  servicepoints: ServicePointDTO[];
  totalRecords: number;
}

export interface CalendarResponseDTO {
  calendars: CalendarDTO[];
  totalRecords: number;
}

export interface DateResponseDTO {
  dates: DailyOpeningInfo[];
  totalRecords: number;
}
