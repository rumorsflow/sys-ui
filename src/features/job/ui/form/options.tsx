import React, { useEffect, useMemo } from 'react'
import {
  ArrayPath,
  Control,
  FieldArrayPath,
  FieldArray,
  FieldPath,
  FieldValues,
  useFieldArray,
  UseFormRegister,
  UseFormGetValues,
  useWatch,
} from 'react-hook-form'
import { SimpleGrid, TextInput } from '@mantine/core'

import { JOB_NAMES, JobOption, QUEUES } from '@/api'

type OptionsProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>
  register: UseFormRegister<TFieldValues>
  getValues: UseFormGetValues<TFieldValues>
}

export const Options = <TFieldValues extends FieldValues = FieldValues>({
  control,
  register,
  getValues,
}: OptionsProps<TFieldValues>) => {
  const watchName = useWatch<TFieldValues>({ control, name: 'name' as FieldPath<TFieldValues> })

  const { fields, update } = useFieldArray<TFieldValues, FieldArrayPath<TFieldValues>>({
    control,
    name: 'options' as ArrayPath<TFieldValues>,
  })

  const queueIndex = useMemo(() => {
    const opts = getValues('options' as FieldPath<TFieldValues>) as JobOption[]

    return opts.findIndex((o) => o.type === 'queue')
  }, [getValues])

  useEffect(() => {
    if (queueIndex > -1) {
      update(queueIndex, {
        type: 'queue',
        value: watchName === JOB_NAMES[0] ? QUEUES[0] : QUEUES[1],
      } as FieldArray<TFieldValues>)
    }
  }, [watchName, queueIndex, update])

  return (
    <SimpleGrid cols={2} spacing="sm" verticalSpacing="sm" breakpoints={[{ maxWidth: 'xs', cols: 1 }]}>
      {fields.map((field, index) => (
        <React.Fragment key={field.id}>
          <TextInput size="md" {...register(`options.${index}.type` as FieldPath<TFieldValues>)} disabled={true} />
          <TextInput size="md" placeholder="value" {...register(`options.${index}.value` as FieldPath<TFieldValues>)} />
        </React.Fragment>
      ))}
    </SimpleGrid>
  )
}
