import React, { useCallback, useState } from 'react'
import { Link, useAsyncValue } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import { ActionIcon, createStyles, Group, rem, Text, UnstyledButton, Image, Box, Badge } from '@mantine/core'
import { IconExternalLink } from '@tabler/icons-react'

import { Article, Page } from '@/api'
import { domain, formatDateTime } from '@/lib'
import { Col, DeleteModal, Table } from '@/ui'

const cols: Col<Article>[] = [
  { label: 'N°' },
  { label: 'Title', sort: 'title', sx: { minWidth: rem(450) } },
  { label: 'Site', sort: 'site_id' },
  { label: 'Source', sort: 'source' },
  { label: 'Published', sort: 'pub_date' },
  { label: 'Created At', sort: 'created_at' },
  { label: 'Updated At', sort: 'updated_at' },
  { label: ' ' },
]

const useStyles = createStyles(() => ({
  td: {
    whiteSpace: 'nowrap',
    flexGrow: 1,
  },
}))

type RowProps = {
  no: number
  item: Article
  classTd: string
  onDelete: (item: Article) => void
}

const Row: React.FC<RowProps> = ({ no, item, classTd, onDelete }) => (
  <>
    <td>{no}</td>
    <td>
      <UnstyledButton component={Link} to={`/articles/${item.id}`}>
        <Group noWrap spacing={0}>
          <Image
            src={item.media?.find((i) => i.type === 'image')?.url ?? null}
            width={100}
            radius="xs"
            alt="no image"
          />
          <Box pl="sm">
            <Text size="sm">{item.title}</Text>
          </Box>
        </Group>
      </UnstyledButton>
    </td>
    <td>
      <UnstyledButton component={Link} to={`/articles/${item.id}`}>
        <Text size="sm" className={classTd}>
          {domain(item.link)}
        </Text>
      </UnstyledButton>
    </td>
    <td>
      <Badge variant="outline" color="gray" size="lg">
        {item.source}
      </Badge>
    </td>
    <td>
      <Text size="sm" className={classTd}>
        {formatDateTime(item.pub_date, { dateStyle: 'short' })}
      </Text>
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
    <Table.Actions editLink={`/articles/${item.id}`} onDelete={() => onDelete(item)}>
      <ActionIcon component="a" href={item.link} target="_blank">
        <IconExternalLink size={20} stroke={1.5} />
      </ActionIcon>
    </Table.Actions>
  </>
)

export const ArticleList: React.FC = () => {
  const { classes } = useStyles()
  const { data: page } = useAsyncValue() as { data: Page<Article> }
  const [opened, { open, close }] = useDisclosure(false)
  const [article, setArticle] = useState<Article | null>(null)

  const onDelete = useCallback(
    (item: Article) => {
      setArticle(item)
      open()
    },
    [open]
  )

  const row = useCallback(
    (item: Article, index: number, pageIndex: number) => (
      <Row no={index + pageIndex + 1} item={item} classTd={classes.td} onDelete={onDelete} />
    ),
    [classes.td, onDelete]
  )

  return (
    <>
      <Table page={page} cols={cols} row={row} />
      {article && (
        <DeleteModal
          title={`Delete ${domain(article.link)} article`}
          action={`/articles/${article.id}/delete`}
          opened={opened}
          onClose={close}
          text
        >
          Are you sure you want to delete the &quot;{article.title}&quot; article?
        </DeleteModal>
      )}
    </>
  )
}
