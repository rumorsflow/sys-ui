import React, { useCallback, useMemo } from 'react'
import { Form as BaseForm, FormMethod, useSubmit } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import { Button, Group, LoadingOverlay, Paper, Tabs } from '@mantine/core'
import * as yup from 'yup'
import { IconBroadcast, IconDeviceFloppy, IconKey, IconSmartHome, IconTrash } from '@tabler/icons-react'

import { Chat, CHAT_TYPES, Site } from '@/api'
import { useForm } from '@/hooks'
import { toForm } from '@/lib'
import { DeleteModal } from '@/ui'

import { Main } from './main'
import { Broadcast } from './broadcast'
import { Rights } from './rights'

type FormProps = {
  method: 'post' | 'patch'
  sites: Site[]
  chat?: Chat
}

const schema = yup
  .object({
    telegram_id: yup.number().required().default(0),
    type: yup.string().required().oneOf(CHAT_TYPES).default(CHAT_TYPES[0]),
    title: yup.string().optional().max(254).default(''),
    username: yup.string().optional().max(254).default(''),
    first_name: yup.string().optional().max(254).default(''),
    last_name: yup.string().optional().max(254).default(''),
    broadcast: yup.array(yup.string().required().uuid()).optional().default([]),
    blocked: yup.boolean().default(false),
    deleted: yup.boolean().default(false),
  })
  .required()

type ChatForm = yup.InferType<typeof schema>

export const Form: React.FC<FormProps> = ({ method, sites, chat }) => {
  const [opened, { open, close }] = useDisclosure(false)

  const defaultValues = useMemo(() => {
    if (chat) {
      return schema.cast(chat, { stripUnknown: true })
    }

    const { telegram_id, ...rest } = schema.cast({})  // eslint-disable-line

    return rest
  }, [chat])

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    disabled,
    isLoading,
  } = useForm<ChatForm>(schema, defaultValues)

  const submit = useSubmit()

  const onSubmit = useCallback(
    (data: ChatForm) => {
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
          <Tabs.Tab value="broadcast" icon={<IconBroadcast size="0.8rem" />}>
            Broadcast
          </Tabs.Tab>
          {chat?.rights && Object.keys(chat.rights).length > 0 && (
            <Tabs.Tab value="rights" icon={<IconKey size="0.8rem" />}>
              Rights
            </Tabs.Tab>
          )}
        </Tabs.List>

        <Tabs.Panel value="main" pt="sm">
          <Main edit={!!chat} control={control} register={register} errors={errors} />
        </Tabs.Panel>

        <Tabs.Panel value="broadcast" pt="sm">
          <Broadcast control={control} sites={sites} />
        </Tabs.Panel>

        {chat?.rights && Object.keys(chat.rights).length > 0 && (
          <Tabs.Panel value="rights" pt="sm">
            <Rights rights={chat.rights} />
          </Tabs.Panel>
        )}
      </Tabs>
      <Group mt="sm" position="right" spacing="sm">
        {chat && (
          <>
            <Button color="red" size="md" leftIcon={<IconTrash stroke={1.5} />} onClick={open}>
              Delete
            </Button>
            <DeleteModal title="Delete chat" action={`/chats/${chat.id}/delete`} opened={opened} onClose={close} text>
              Are you sure you want to delete the &quot;{chat.title ?? chat.username}&quot; chat?
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
