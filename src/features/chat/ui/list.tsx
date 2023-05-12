import React, { useCallback, useState } from 'react'
import { Link, useAsyncValue } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import { Badge, createStyles, Text, UnstyledButton } from '@mantine/core'

import { Chat, Page } from '@/api'
import { formatDateTime } from '@/lib'
import { Col, DeleteModal, Table } from '@/ui'

const cols: Col<Chat>[] = [
  { label: 'N°' },
  { label: 'Tg ID', sort: 'telegram_id' },
  { label: 'Type', sort: 'type' },
  { label: 'Title' },
  { label: 'Username', sort: 'username' },
  { label: 'Name' },
  { label: 'Created At', sort: 'created_at' },
  { label: 'Updated At', sort: 'updated_at' },
  { label: 'Blocked', sort: 'blocked' },
  { label: 'Deleted', sort: 'deleted' },
  { label: ' ' },
]

const useStyles = createStyles(() => ({
  td: {
    whiteSpace: 'nowrap',
    flexGrow: 1,
  },
}))

type LinkCellProps = {
  id: string
  label: string
  classLink: string
}

const LinkCell: React.FC<LinkCellProps> = ({ id, label, classLink }) => (
  <UnstyledButton component={Link} to={`/chats/${id}`} className={classLink}>
    <Text size="sm">{label}</Text>
  </UnstyledButton>
)

type RowProps = {
  no: number
  item: Chat
  classTd: string
  onDelete: (item: Chat) => void
}

const Row: React.FC<RowProps> = ({ no, item, classTd, onDelete }) => (
  <>
    <td>{no}</td>
    <td>
      <LinkCell id={item.id} label={`${item.telegram_id}`} classLink={classTd} />
    </td>
    <td>
      <LinkCell id={item.id} label={item.type} classLink={classTd} />
    </td>
    <td>
      <LinkCell id={item.id} label={item.title ?? ''} classLink={classTd} />
    </td>
    <td>
      <LinkCell id={item.id} label={item.username ?? ''} classLink={classTd} />
    </td>
    <td>
      <LinkCell id={item.id} label={`${item.first_name ?? ''} ${item.last_name ?? ''}`} classLink={classTd} />
    </td>
    <td>
      <Text size="sm" className={classTd}>
        {formatDateTime(item.created_at, { dateStyle: 'short' })}
      </Text>
    </td>
    <td>
      <Text size="sm" className={classTd}>
        {formatDateTime(item.updated_at, { dateStyle: 'short' })}
      </Text>
    </td>
    <td>
      <Badge variant="outline" color={item?.blocked ? 'green' : 'red'}>
        {item?.blocked ? 'yes' : 'no'}
      </Badge>
    </td>
    <td>
      <Badge variant="outline" color={item?.deleted ? 'green' : 'red'}>
        {item?.deleted ? 'yes' : 'no'}
      </Badge>
    </td>
    <Table.Actions editLink={`/chats/${item.id}`} onDelete={() => onDelete(item)} />
  </>
)

export const ChatList: React.FC = () => {
  const { classes } = useStyles()
  const { data: page } = useAsyncValue() as { data: Page<Chat> }
  const [opened, { open, close }] = useDisclosure(false)
  const [chat, setChat] = useState<Chat | null>(null)

  const onDelete = useCallback(
    (item: Chat) => {
      setChat(item)
      open()
    },
    [open]
  )

  const row = useCallback(
    (item: Chat, index: number, pageIndex: number) => (
      <Row no={index + pageIndex + 1} item={item} classTd={classes.td} onDelete={onDelete} />
    ),
    [classes.td, onDelete]
  )

  return (
    <>
      <Table page={page} cols={cols} row={row} />
      {chat && (
        <DeleteModal
          title={`Delete ${chat.telegram_id} chat`}
          action={`/chats/${chat.id}/delete`}
          opened={opened}
          onClose={close}
          text
        >
          Are you sure you want to delete the &quot;{chat.telegram_id}&quot; chat?
        </DeleteModal>
      )}
    </>
  )
}
