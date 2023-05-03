import { ExceptionRowState } from '../../components/fields/ExceptionFieldTypes';
import { HoursOfOperationRowState } from '../../components/fields/HoursOfOperationFieldTypes';
import { ServicePoint } from '../../types/types';

export interface FormValues {
  name: string;
  'start-date': string;
  'end-date': string;
  'service-points': ServicePoint[];
  'hours-of-operation': HoursOfOperationRowState[];
  exceptions: ExceptionRowState[];
}

export type SimpleErrorFormValues = Omit<
  FormValues,
  'hours-of-operation' | 'exceptions'
>;
