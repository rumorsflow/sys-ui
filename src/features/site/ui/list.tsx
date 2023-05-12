import React, { useCallback, useState } from 'react'
import { Link, useAsyncValue } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import { createStyles, Group, Text, rem, UnstyledButton, Badge } from '@mantine/core'

import { Page, Site } from '@/api'
import { formatDateTime } from '@/lib'
import { Col, DeleteModal, Table } from '@/ui'

const cols: Col<Site>[] = [
  { label: 'N°' },
  { label: 'Domain', sort: 'domain' },
  { label: 'Title', sort: 'title' },
  { label: 'Languages' },
  { label: 'Created At', sort: 'created_at', sx: { width: rem(135), minWidth: rem(135) } },
  { label: 'Updated At', sort: 'updated_at', sx: { width: rem(135), minWidth: rem(135) } },
  { label: 'Enabled', sort: 'enabled', sx: { width: rem(115), minWidth: rem(115) } },
  { label: ' ', sx: { width: rem(90), minWidth: rem(90) } },
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
  <UnstyledButton component={Link} to={`/sites/${id}`} className={classLink}>
    <Text size="sm">{label}</Text>
  </UnstyledButton>
)

type RowProps = {
  no: number
  item: Site
  classTd: string
  onDelete: (item: Site) => void
}

const Row: React.FC<RowProps> = ({ no, item, classTd, onDelete }) => (
  <>
    <td>{no}</td>
    <td>
      <LinkCell id={item.id} label={item.domain} classLink={classTd} />
    </td>
    <td>
      <LinkCell id={item.id} label={item.title} classLink={classTd} />
    </td>
    <td>
      <Group spacing={5} noWrap>
        {item.languages.map((lang) => (
          <Badge key={lang} variant="light">
            {lang.toUpperCase()}
          </Badge>
        ))}
      </Group>
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
      <Badge variant="outline" color={item.enabled ? 'green' : 'red'}>
        {item.enabled ? 'yes' : 'no'}
      </Badge>
    </td>
    <Table.Actions editLink={`/sites/${item.id}`} onDelete={() => onDelete(item)} />
  </>
)

export const SiteList: React.FC = () => {
  const { classes } = useStyles()
  const { data: page } = useAsyncValue() as { data: Page<Site> }
  const [opened, { open, close }] = useDisclosure(false)
  const [site, setSite] = useState<Site | null>(null)

  const onDelete = useCallback(
    (item: Site) => {
      setSite(item)
      open()
    },
    [open]
  )

  const row = useCallback(
    (item: Site, index: number, pageIndex: number) => (
      <Row no={index + pageIndex + 1} item={item} classTd={classes.td} onDelete={onDelete} />
    ),
    [classes.td, onDelete]
  )

  return (
    <>
      <Table page={page} cols={cols} row={row} />
      {site && (
        <DeleteModal
          title={`Delete ${site.domain}`}
          action={`/sites/${site.id}/delete`}
          opened={opened}
          onClose={close}
          text
        >
          Are you sure you want to delete the &quot;{site.title}&quot; site?
        </DeleteModal>
      )}
    </>
  )
}
