import React from 'react'
import { Controller, FieldPath, FieldValues, UseControllerProps } from 'react-hook-form'
import { Switch as BaseSwitch, SwitchProps as BaseSwitchProps, useMantineTheme } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons-react'

type SwitchProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = UseControllerProps<
  TFieldValues,
  TName
> &
  Omit<BaseSwitchProps, 'name' | 'defaultValue' | 'thumbIcon' | 'checked' | 'onChange'>

export const Switch = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  size = 'md',
  radius = 'sm',
  color = 'teal',
  name,
  rules,
  shouldUnregister,
  defaultValue,
  control,
  ...rest
}: SwitchProps<TFieldValues, TName>) => {
  const theme = useMantineTheme()

  return (
    <Controller
      name={name}
      rules={rules}
      shouldUnregister={shouldUnregister}
      defaultValue={defaultValue}
      control={control}
      render={({ field }) => (
        <BaseSwitch
          name={name}
          size={size}
          radius={radius}
          color={color}
          thumbIcon={
            field.value ? (
              <IconCheck size="0.8rem" color={theme.colors.teal[theme.fn.primaryShade()]} stroke={3} />
            ) : (
              <IconX size="0.8rem" color={theme.colors.red[theme.fn.primaryShade()]} stroke={3} />
            )
          }
          checked={field.value}
          onChange={field.onChange}
          {...rest}
        />
      )}
    />
  )
}
