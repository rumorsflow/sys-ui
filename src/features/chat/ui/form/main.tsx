import React from 'react'
import { Control, FieldErrors, FieldPath, FieldValues, UseFormRegister } from 'react-hook-form'
import { SimpleGrid, TextInput, Group } from '@mantine/core'

import { chatTypesSource } from '@/config'
import { Select, Switch } from '@/ui'

type MainProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>
  register: UseFormRegister<TFieldValues>
  errors: FieldErrors<TFieldValues>
  edit: boolean
}

export const Main = <TFieldValues extends FieldValues = FieldValues>({
  control,
  register,
  errors,
  edit,
}: MainProps<TFieldValues>) => (
  <>
    <SimpleGrid cols={2} spacing="sm" verticalSpacing="sm" breakpoints={[{ maxWidth: 'xs', cols: 1 }]}>
      <TextInput
        size="md"
        label="Telegram ID"
        placeholder="Telegram ID"
        disabled={edit}
        error={errors.telegram_id?.message as string | undefined}
        {...register('telegram_id' as FieldPath<TFieldValues>, { valueAsNumber: true })}
        withAsterisk
      />
      <Select
        name={'type' as FieldPath<TFieldValues>}
        label="Type"
        placeholder="Pick type"
        data={chatTypesSource}
        error={errors.type?.message as string | undefined}
        control={control}
        disabled={edit}
        withAsterisk
      />
      <TextInput
        size="md"
        label="Title"
        placeholder="Chat title"
        disabled={edit}
        error={errors.title?.message as string | undefined}
        {...register('title' as FieldPath<TFieldValues>)}
      />
      <TextInput
        size="md"
        label="Username"
        placeholder="Chat username"
        disabled={edit}
        error={errors.username?.message as string | undefined}
        {...register('username' as FieldPath<TFieldValues>)}
      />
      <TextInput
        size="md"
        label="First name"
        placeholder="Chat first name"
        disabled={edit}
        error={errors.first_name?.message as string | undefined}
        {...register('first_name' as FieldPath<TFieldValues>)}
      />
      <TextInput
        size="md"
        label="Last name"
        placeholder="Chat last name"
        disabled={edit}
        error={errors.last_name?.message as string | undefined}
        {...register('last_name' as FieldPath<TFieldValues>)}
      />
    </SimpleGrid>
    <Group mt="sm" spacing="sm" position="right">
      <Switch label="Blocked" name={'blocked' as FieldPath<TFieldValues>} control={control} />
      <Switch label="Deleted" disabled={edit} name={'deleted' as FieldPath<TFieldValues>} control={control} />
    </Group>
  </>
)
