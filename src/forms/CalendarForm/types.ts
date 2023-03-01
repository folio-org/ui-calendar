import { FieldRenderProps } from 'react-final-form';
import { ServicePoint } from '../../types/types';
import {
  ExceptionFieldErrors,
  ExceptionRowState
} from '../../components/fields/ExceptionFieldTypes';
import { HoursOfOperationRowState } from '../../components/fields/HoursOfOperationFieldTypes';

export interface FormValues {
  name: string;
  'start-date': string;
  'end-date': string;
  'service-points': ServicePoint[];
  'hours-of-operation': HoursOfOperationRowState[];
  exceptions: ExceptionRowState[];
}

export interface InnerFieldRefs {
  hoursOfOperation: {
    startTime: Record<number, HTMLInputElement>;
    endTime: Record<number, HTMLInputElement>;
  };
  exceptions: {
    startDate: Record<number, Record<number, HTMLInputElement>>;
    startTime: Record<number, Record<number, HTMLInputElement>>;
    endDate: Record<number, Record<number, HTMLInputElement>>;
    endTime: Record<number, Record<number, HTMLInputElement>>;
  };
}

export interface ExceptionFieldProps
  extends FieldRenderProps<ExceptionRowState[]> {
  fieldRefs: InnerFieldRefs['exceptions'];
  error?: ExceptionFieldErrors;
  submitAttempted: boolean;
}

export type SimpleErrorFormValues = Omit<
  FormValues,
  'hours-of-operation' | 'exceptions'
>;
