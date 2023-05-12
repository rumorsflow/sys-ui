import React, { useCallback, useMemo } from 'react'
import { FormMethod, useSubmit, Form as BaseForm } from 'react-router-dom'
import { IconDeviceFloppy, IconTrash } from '@tabler/icons-react'
import { Button, Group, LoadingOverlay, Paper, SimpleGrid, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import * as yup from 'yup'

import { languagesSource } from '@/config'
import { Site } from '@/api'
import { toForm } from '@/lib'
import { useForm } from '@/hooks'
import { DeleteModal, MultiSelect, Switch } from '@/ui'

type FormProps = {
  method: 'post' | 'patch'
  site?: Site
}

const schema = yup
  .object({
    domain: yup.string().required().default(''),
    favicon: yup.string().required().default(''),
    title: yup.string().required().max(254).default(''),
    languages: yup
      .array(
        yup
          .string()
          .required()
          .oneOf(languagesSource.map((i) => i.value))
      )
      .required()
      .min(1)
      .default([]),
    enabled: yup.boolean().default(false),
  })
  .required()

type SiteForm = yup.InferType<typeof schema>

export const Form: React.FC<FormProps> = ({ method, site }) => {
  const [opened, { open, close }] = useDisclosure(false)
  const initialValues = useMemo(() => schema.cast(site ?? {}, { stripUnknown: true }), [site])

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    disabled,
    isLoading,
  } = useForm<SiteForm>(schema, initialValues)

  const submit = useSubmit()

  const onSubmit = useCallback(
    (data: SiteForm) => {
      submit(toForm(data), { method: method as FormMethod })
    },
    [method, submit]
  )

  return (
    <Paper component={BaseForm} onSubmit={handleSubmit(onSubmit)} sx={{ position: 'relative' }}>
      <LoadingOverlay visible={isLoading} overlayBlur={2} radius="xs" />
      <SimpleGrid cols={2} spacing="sm" verticalSpacing="sm" breakpoints={[{ maxWidth: 'xs', cols: 1 }]}>
        <TextInput
          size="md"
          label="Domain"
          placeholder="domain.com"
          error={errors.domain?.message}
          {...register('domain')}
          withAsterisk
        />
        <TextInput
          size="md"
          label="Title"
          placeholder="Site title"
          error={errors.title?.message}
          {...register('title')}
          withAsterisk
        />
      </SimpleGrid>
      <TextInput
        mt="sm"
        size="md"
        label="Favicon"
        placeholder="domain.com/favicon.ico"
        error={errors.favicon?.message}
        {...register('favicon')}
        withAsterisk
      />
      <MultiSelect
        mt="sm"
        name="languages"
        label="Languages"
        placeholder="Pick languages"
        data={languagesSource}
        error={errors.languages?.message}
        control={control}
        searchable
        withAsterisk
      />
      <Group mt="sm" position="right">
        <Switch label="Enabled" name="enabled" control={control} />
      </Group>
      <Group mt="sm" position={site ? 'right' : 'right'} spacing="sm">
        {site && (
          <>
            <Button color="red" size="md" leftIcon={<IconTrash stroke={1.5} />} onClick={open}>
              Delete
            </Button>
            <DeleteModal
              title={`Delete ${site.domain}`}
              action={`/sites/${site.id}/delete`}
              opened={opened}
              onClose={close}
              text
            >
              Are you sure you want to delete the &quot;{site.title}&quot; site?
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
