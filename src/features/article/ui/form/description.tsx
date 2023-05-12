import React from 'react'
import { FieldValues, UseFormRegister, FieldErrors, FieldPath } from 'react-hook-form'
import { Stack, Textarea } from '@mantine/core'

type DescriptionProps<TFieldValues extends FieldValues = FieldValues> = {
  register: UseFormRegister<TFieldValues>
  errors: FieldErrors<TFieldValues>
}

export const Description = <TFieldValues extends FieldValues = FieldValues>({
  register,
  errors,
}: DescriptionProps<TFieldValues>) => (
  <Stack spacing="sm">
    <Textarea
      size="md"
      label="Short description"
      placeholder="Article short description"
      error={errors.short_desc?.message as string | undefined}
      {...register('short_desc' as FieldPath<TFieldValues>)}
      minRows={5}
      maxRows={12}
      autosize
    />
    <Textarea
      size="md"
      label="Long description"
      placeholder="Article long description"
      error={errors.long_desc?.message as string | undefined}
      {...register('long_desc' as FieldPath<TFieldValues>)}
      minRows={5}
      maxRows={12}
      autosize
    />
  </Stack>
)
