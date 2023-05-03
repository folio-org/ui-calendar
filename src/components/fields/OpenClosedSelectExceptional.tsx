import React, { useEffect } from 'react';
import { useField, useForm } from 'react-final-form';
import { useFieldArray } from 'react-final-form-arrays';
import OpenClosedSelect from './OpenClosedSelect';
import RowType from './RowType';

/**
 * Wraps {@link OpenClosedSelect} with a listener that will remove
 * additional internal rows when the select is changed to &quot;Closed&quot;
 */
export default function OpenClosedSelectExceptional({
  name,
  rowsName,
}: {
  name: string;
  rowsName: string;
}) {
  const form = useForm();
  const rowsArray = useFieldArray(rowsName);

  const value = useField<RowType>(name).input.value;

  useEffect(() => {
    if (value === RowType.Closed && (rowsArray.fields.length as number) > 1) {
      form.mutators.removeBatch(
        rowsName,
        Array.from(Array(rowsArray.fields.length).keys()).slice(1)
      );
    }
  }, [form.mutators, rowsArray.fields.length, rowsName, value]);

  return <OpenClosedSelect name={name} />;
}
