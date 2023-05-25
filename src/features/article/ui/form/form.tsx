import React, { useCallback, useMemo } from 'react'
import { FormMethod, useSubmit, Form as BaseForm } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import { Button, Group, LoadingOverlay, Paper, Tabs } from '@mantine/core'
import { IconDeviceFloppy, IconPhoto, IconSmartHome, IconTrash } from '@tabler/icons-react'
import * as yup from 'yup'

import { languagesSource } from '@/config'
import { Article, MEDIA_TYPES } from '@/api'
import { useForm } from '@/hooks'
import { toForm } from '@/lib'
import { DeleteModal } from '@/ui'

import { Main } from './main'
import { Media } from './media'

type FormProps = {
  method: 'post' | 'patch'
  article?: Article
}

const schema = yup
  .object({
    lang: yup
      .string()
      .required()
      .oneOf(languagesSource.map((i) => i.value))
      .default(languagesSource[0].value),
    title: yup.string().required().max(254).default(''),
    desc: yup.string().optional().max(500).default(''),
    media: yup
      .array(
        yup.object({
          url: yup.string().required(),
          type: yup.string().required().oneOf(MEDIA_TYPES),
        })
      )
      .optional()
      .default([]),
  })
  .required()

type ArticleForm = yup.InferType<typeof schema>

export const Form: React.FC<FormProps> = ({ method, article }) => {
  const [opened, { open, close }] = useDisclosure(false)
  const initialValues = useMemo(() => schema.cast(article ?? {}, { stripUnknown: true }), [article])

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    disabled,
    isLoading,
  } = useForm<ArticleForm>(schema, initialValues)

  const submit = useSubmit()

  const onSubmit = useCallback(
    (data: typeof initialValues) => {
      submit(toForm(data), { method: method as FormMethod })
    },
    [method, submit]
  )

  return (
    <Paper component={BaseForm} onSubmit={handleSubmit(onSubmit)} sx={{ position: 'relative' }}>
      <LoadingOverlay visible={isLoading} overlayBlur={2} radius="xs" />
      <Tabs defaultValue="main">
        <Tabs.List sx={{ flexWrap: 'nowrap' }}>
          <Tabs.Tab value="main" icon={<IconSmartHome size="0.8rem" />}>
            Main
          </Tabs.Tab>
          <Tabs.Tab value="media" icon={<IconPhoto size="0.8rem" />}>
            Media
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="main" pt="sm">
          <Main control={control} register={register} errors={errors} />
        </Tabs.Panel>

        <Tabs.Panel value="media" pt="sm">
          <Media control={control} register={register} />
        </Tabs.Panel>
      </Tabs>
      <Group mt="sm" position="right" spacing="sm">
        {article && (
          <>
            <Button color="red" size="md" leftIcon={<IconTrash stroke={1.5} />} onClick={open}>
              Delete
            </Button>
            <DeleteModal
              title="Delete article"
              action={`/articles/${article.id}/delete`}
              opened={opened}
              onClose={close}
              text
            >
              Are you sure you want to delete the &quot;{article.title}&quot; article?
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
