import type { ComponentType } from 'react';
import type { FormProps, FormRenderProps } from 'react-final-form';

export default function stripesFinalForm<
  ExtraProps = Record<string, never>,
  FormValues = Record<string, any>,
  InitialFormValues = Partial<FormValues>
>(
  opts: Omit<
    FormProps<FormValues, InitialFormValues>,
    'onSubmit' | 'initialValues'
  >
): (
  component: ComponentType<
    FormRenderProps<FormValues, InitialFormValues> & ExtraProps
  >
) => ComponentType<
  ExtraProps &
    Pick<FormProps<FormValues, InitialFormValues>, 'onSubmit' | 'initialValues'>
>;

export as namespace STRIPESFF;
