import React from 'react'
import { Controller, FieldPath, FieldValues, UseControllerProps } from 'react-hook-form'
import { Select as BaseSelect, SelectProps as BaseSelectProps } from '@mantine/core'

type SelectProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = UseControllerProps<
  TFieldValues,
  TName
> &
  Omit<BaseSelectProps, 'name' | 'defaultValue' | 'onChange'>

export const Select = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  size = 'md',
  name,
  rules,
  shouldUnregister,
  defaultValue,
  control,
  ...rest
}: SelectProps<TFieldValues, TName>) => (
  <Controller
    name={name}
    rules={rules}
    shouldUnregister={shouldUnregister}
    defaultValue={defaultValue}
    control={control}
    render={({ field }) => <BaseSelect size={size} defaultValue={field.value} onChange={field.onChange} {...rest} />}
  />
)
