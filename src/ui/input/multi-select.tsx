import React from 'react'
import { Controller, FieldPath, FieldValues, UseControllerProps } from 'react-hook-form'
import { MultiSelect as BaseMultiSelect, MultiSelectProps as BaseMultiSelectProps } from '@mantine/core'

type MultiSelectProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = UseControllerProps<
  TFieldValues,
  TName
> &
  Omit<BaseMultiSelectProps, 'name' | 'defaultValue' | 'onChange'> & {
    fieldValue?: boolean
  }

export const MultiSelect = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  size = 'md',
  name,
  rules,
  shouldUnregister,
  defaultValue,
  control,
  fieldValue,
  data,
  ...rest
}: MultiSelectProps<TFieldValues, TName>) => (
  <Controller
    name={name}
    rules={rules}
    shouldUnregister={shouldUnregister}
    defaultValue={defaultValue}
    control={control}
    render={({ field }) => (
      <BaseMultiSelect
        data={fieldValue ? field.value ?? data : data}
        size={size}
        defaultValue={field.value}
        onChange={field.onChange}
        {...rest}
      />
    )}
  />
)
