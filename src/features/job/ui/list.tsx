import React, { useCallback, useMemo, useState } from 'react'
import { Link, useAsyncValue } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import { Badge, Code, createStyles, Spoiler, Text, UnstyledButton } from '@mantine/core'
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'

import { Job, Page } from '@/api'
import { useStats } from '@/store'
import { durationBefore, formatDateTime, timeAgo, truncate } from '@/lib'
import { Col, DeleteModal, Table } from '@/ui'

const cols: Col<Job>[] = [
  { label: 'N°' },
  { label: 'Cron', sort: 'cron_expr' },
  { label: 'Name', sort: 'name' },
  { label: 'Payload / Options', sx: { width: '24.5rem' } },
  { label: 'Created At', sort: 'created_at' },
  { label: 'Updated At', sort: 'updated_at' },
  { label: 'Enabled', sort: 'enabled' },
  { label: 'Next' },
  { label: 'Prev' },
  { label: ' ' },
]

const useStyles = createStyles((theme) => ({
  td: {
    whiteSpace: 'nowrap',
    flexGrow: 1,
  },
  payload: {
    width: '20rem',
    fontSize: '0.6rem',

    [`@media (min-width: ${theme.breakpoints.sm})`]: {
      width: '25.5rem',
      fontSize: theme.fontSizes.xs,
    },
  },
}))

type CellProps = {
  job: Job
  className: string
}

const EntryCells: React.FC<CellProps> = ({ job, className }) => {
  const entry = useStats((state) => state.schedulerEntries[job.id])

  return (
    <>
      <td>
        <Text size="sm" className={className}>
          {entry ? durationBefore(entry.next_enqueue_at) : 'N/A'}
        </Text>
      </td>
      <td>
        <Text size="sm" className={className}>
          {entry?.prev_enqueue_at ? timeAgo(entry.prev_enqueue_at) : 'N/A'}
        </Text>
      </td>
    </>
  )
}

const PayloadCell: React.FC<CellProps> = ({ job, className }) => {
  const text = useMemo(() => {
    const payload = job.payload ? JSON.stringify(job.payload, null, 2) : undefined
    const options = job.options
      ?.filter((o) => !!o.value)
      ?.reduce((acc, cur) => ({ ...acc, [cur.type]: cur.value }), {} as Record<string, string>)
    const opts = Object.keys(options ?? {}).length ? JSON.stringify(options, null, 2) : undefined

    return payload && opts ? `${payload} , ${opts}` : payload ?? opts
  }, [job.payload, job.options])

  const link = useMemo(() => (job.payload?.link ? truncate(job.payload.link, 45) : undefined), [job.payload?.link])

  if (!text) {
    return <td></td>
  }

  return (
    <td>
      <UnstyledButton component={Link} to={`/jobs/${job.id}`}>
        <Text size="sm" sx={{ whiteSpace: 'nowrap' }}>
          {link}
        </Text>
      </UnstyledButton>
      <Spoiler maxHeight={0} showLabel={<IconChevronDown size={16} />} hideLabel={<IconChevronUp size={16} />} mt="xs">
        <Code block className={className} color="gray">
          {text}
        </Code>
      </Spoiler>
    </td>
  )
}

const LinkCell: React.FC<CellProps & { labelKey: keyof Job }> = ({ job, className, labelKey }) => (
  <UnstyledButton component={Link} to={`/jobs/${job.id}`}>
    <Code className={className} color="blue">
      {typeof job[labelKey] === 'string' ? (job[labelKey] as string) : JSON.stringify(job[labelKey])}
    </Code>
  </UnstyledButton>
)

type RowProps = {
  no: number
  item: Job
  classTd: string
  classPayload: string
  onDelete: (item: Job) => void
}

const Row: React.FC<RowProps> = ({ no, item, classTd, classPayload, onDelete }) => (
  <>
    <td>{no}</td>
    <td>
      <LinkCell job={item} className={classTd} labelKey="cron_expr" />
    </td>
    <td>
      <LinkCell job={item} className={classTd} labelKey="name" />
    </td>
    <PayloadCell job={item} className={classPayload} />
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
    <EntryCells job={item} className={classTd} />
    <Table.Actions editLink={`/jobs/${item.id}`} onDelete={() => onDelete(item)} />
  </>
)

export const JobList: React.FC = () => {
  const { classes } = useStyles()
  const { data: page } = useAsyncValue() as { data: Page<Job> }
  const [opened, { open, close }] = useDisclosure(false)
  const [job, setJob] = useState<Job | null>(null)

  const onDelete = useCallback(
    (item: Job) => {
      setJob(item)
      open()
    },
    [open]
  )

  const row = useCallback(
    (job: Job, index: number, pageIndex: number) => (
      <Row
        no={index + pageIndex + 1}
        item={job}
        classTd={classes.td}
        classPayload={classes.payload}
        onDelete={onDelete}
      />
    ),
    [classes.td, classes.payload, onDelete]
  )

  return (
    <>
      <Table page={page} cols={cols} row={row} verticalAlign="top" />
      {job && (
        <DeleteModal
          title={`Delete ${job.name} job`}
          action={`/jobs/${job.id}/delete`}
          opened={opened}
          onClose={close}
          text
        >
          Are you sure you want to delete the &quot;{job.name}&quot; job?
        </DeleteModal>
      )}
    </>
  )
}
