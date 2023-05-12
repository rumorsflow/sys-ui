import React, { useCallback, useEffect, useMemo } from 'react'
import { Form as BaseForm, FormMethod, useSubmit } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import { Button, Group, LoadingOverlay, Paper, Tabs } from '@mantine/core'
import { IconDeviceFloppy, IconSettings, IconSmartHome, IconTrash } from '@tabler/icons-react'
import * as yup from 'yup'

import { languagesSource } from '@/config'
import { defaultJobOptions, Job, JOB_NAMES, JOB_OPTIONS, JobOptionType, QUEUES, Site } from '@/api'
import { useForm } from '@/hooks'
import { toForm } from '@/lib'
import { DeleteModal } from '@/ui'

import { Main } from './main'
import { Options } from './options'

type FormProps = {
  method: 'post' | 'patch'
  sites: Site[]
  job?: Job
}

const schema = yup
  .object({
    cron_expr: yup.string().min(9).max(254).required().default('@every 5m'),
    name: yup.string().oneOf(JOB_NAMES).max(254).required().default(JOB_NAMES[0]),
    payload: yup
      .object()
      .when('name', {
        is: (val: string) => val === JOB_NAMES[0],
        then: (schema) =>
          schema.shape({
            site_id: yup.string().required().uuid(),
            link: yup.string().required().url(),
          }),
        otherwise: (schema) =>
          schema.shape({
            site_id: yup.string().required().uuid(),
            link: yup.string().required().url(),
            lang: yup
              .string()
              .oneOf(languagesSource.map((i) => i.value))
              .optional(),
            match_loc: yup.string().max(500).optional(),
            search_loc: yup.string().max(500).optional(),
            search_link: yup.string().max(500).optional(),
            index: yup.boolean().required().default(false),
            stop_on_dup: yup.boolean().required().default(false),
          }),
      })
      .optional()
      .default({ site_id: '', link: '' }),
    options: yup
      .array(
        yup.object({
          type: yup.string().oneOf(JOB_OPTIONS).max(50).required(),
          value: yup.string().max(254).optional(),
        })
      )
      .optional()
      .default(defaultJobOptions(JOB_NAMES[0])),
    enabled: yup.boolean().required().default(false),
  })
  .required()

type JobForm = yup.InferType<typeof schema>

export const Form: React.FC<FormProps> = ({ method, sites, job }) => {
  const [opened, { open, close }] = useDisclosure(false)
  const initialValues = useMemo(() => {
    if (job) {
      const obj = job.options?.reduce(
        (acc, cur) => ({ ...acc, [cur.type]: cur.value }),
        {} as Record<JobOptionType, string>
      )
      const opts = defaultJobOptions().map((o) => ({ type: o.type, value: obj?.[o.type] ?? o.value }))

      return schema.cast({ ...job, options: opts }, { stripUnknown: true })
    }

    return schema.cast({})
  }, [job])

  const { register, control, handleSubmit, getValues, setValue, disabled, isLoading } = useForm<JobForm>(
    schema,
    initialValues
  )

  const submit = useSubmit()

  const onSubmit = useCallback(
    (data: typeof initialValues) => {
      submit(toForm(data), { method: method as FormMethod })
    },
    [method, submit]
  )

  useEffect(() => {
    if (job) {
      const opt = job.options?.find((o) => o.type === 'queue')
      const index = initialValues.options.findIndex((o) => o.type === 'queue')
      if (index > -1 && !opt?.value) {
        setValue(`options.${index}.value`, job.name === JOB_NAMES[0] ? QUEUES[0] : QUEUES[1], { shouldDirty: true })
      }
    }
  }, [job, setValue, initialValues])

  return (
    <Paper component={BaseForm} onSubmit={handleSubmit(onSubmit)} sx={{ position: 'relative' }}>
      <LoadingOverlay visible={isLoading} overlayBlur={2} radius="xs" />
      <Tabs defaultValue="main">
        <Tabs.List sx={{ flexWrap: 'nowrap' }}>
          <Tabs.Tab value="main" icon={<IconSmartHome size="0.8rem" />}>
            Main
          </Tabs.Tab>
          <Tabs.Tab value="options" icon={<IconSettings size="0.8rem" />}>
            Options
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="main" pt="sm">
          <Main control={control} register={register} sites={sites} />
        </Tabs.Panel>

        <Tabs.Panel value="options" pt="sm">
          <Options control={control} register={register} getValues={getValues} />
        </Tabs.Panel>
      </Tabs>
      <Group mt="sm" position="right" spacing="sm">
        {job && (
          <>
            <Button color="red" size="md" leftIcon={<IconTrash stroke={1.5} />} onClick={open}>
              Delete
            </Button>
            <DeleteModal title="Delete job" action={`/jobs/${job.id}/delete`} opened={opened} onClose={close} text>
              Are you sure you want to delete the job?
            </DeleteModal>
          </>
        )}
        <Button type="submit" size="md" disabled={disabled} leftIcon={<IconDeviceFloppy stroke={1.5} />}>
          Save
        </Button>
      </Group>
    </Paper>
  )
}
