import React from 'react'
import { Control, FieldErrors, FieldValues, UseFormRegister, FieldPath } from 'react-hook-form'
import { Stack, Textarea } from '@mantine/core'

import { languagesSource } from '@/config'
import { Select } from '@/ui'

type MainProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>
  register: UseFormRegister<TFieldValues>
  errors: FieldErrors<TFieldValues>
}

export const Main = <TFieldValues extends FieldValues = FieldValues>({
  control,
  register,
  errors,
}: MainProps<TFieldValues>) => (
  <Stack spacing="sm">
    <Select
      name={'lang' as FieldPath<TFieldValues>}
      label="Language"
      placeholder="Pick language"
      data={languagesSource}
      error={errors.lang?.message as string | undefined}
      control={control}
      searchable
      withAsterisk
    />
    <Textarea
      size="md"
      label="Title"
      placeholder="Article title"
      error={errors.title?.message as string | undefined}
      {...register('title' as FieldPath<TFieldValues>)}
      maxRows={10}
      autosize
      withAsterisk
    />
    <Textarea
      size="md"
      label="Description"
      placeholder="Article description"
      error={errors.desc?.message as string | undefined}
      {...register('desc' as FieldPath<TFieldValues>)}
      minRows={5}
      maxRows={15}
      autosize
    />
  </Stack>
)
