import React, { useCallback, useState } from 'react'
import { useSubmit } from 'react-router-dom'
import prettyBytes from 'pretty-bytes'
import { useDisclosure } from '@mantine/hooks'
import { ActionIcon, Paper, rem, Stack, Table, Text, Tooltip } from '@mantine/core'
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react'

import { APP_BASE_URL } from '@/config'
import { ControlQueue } from '@/api'
import { toForm } from '@/lib'
import { useStats } from '@/store'
import { DeleteModal, Table as List } from '@/ui'

const percentage = (numerator: number, denominator: number): string => {
  if (denominator === 0) return '0.00%'
  const perc = ((numerator / denominator) * 100).toFixed(2)

  return `${perc} %`
}

export const QueuesTable = () => {
  const { queues, setPause } = useStats((state) => ({ queues: state.queues, setPause: state.setPause }))
  const submit = useSubmit()
  const [opened, { open, close }] = useDisclosure(false)
  const [qname, setQname] = useState<string | null>(null)

  const onDelete = useCallback(
    (item: string) => {
      setQname(item)
      open()
    },
    [open]
  )

  const onControl = useCallback(
    (item: string, control: ControlQueue) => {
      setPause(item, control === 'pause')
      submit(toForm({ control }), { method: 'post', action: `${APP_BASE_URL}/queues/${item}/control` })
    },
    [submit, setPause]
  )

  if (!queues.length) {
    return <></>
  }

  return (
    <Paper component={Stack} shadow="md" p="sm" miw={rem(600)} withBorder>
      <Table fontSize="sm">
        <thead>
          <tr>
            <th>Queue</th>
            <th>State</th>
            <th>Size</th>
            <th>
              <Text weight={700} size="sm" sx={{ whiteSpace: 'nowrap' }}>
                Memory usage
              </Text>
            </th>
            <th>Latency</th>
            <th>Processed</th>
            <th>Failed</th>
            <th>
              <Text weight={700} size="sm" sx={{ whiteSpace: 'nowrap' }}>
                Error rate
              </Text>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {queues.map((q) => (
            <tr key={q.queue}>
              <td>
                <Text weight={600}>{q.queue}</Text>
              </td>
              <td>{q.paused ? <Text color="red.6">paused</Text> : <Text color="teal.6">run</Text>}</td>
              <td>{q.size}</td>
              <td>{prettyBytes(q.memory_usage_bytes)}</td>
              <td>{q.display_latency}</td>
              <td>{q.processed}</td>
              <td>{q.failed}</td>
              <td>{percentage(q.failed, q.processed)}</td>
              <List.Actions onDelete={() => onDelete(q.queue)}>
                {q.paused ? (
                  <Tooltip label="Resume" position="left">
                    <ActionIcon onClick={() => onControl(q.queue, 'resume')}>
                      <IconPlayerPlay size={20} stroke={1.5} />
                    </ActionIcon>
                  </Tooltip>
                ) : (
                  <Tooltip label="Pause" position="left">
                    <ActionIcon onClick={() => onControl(q.queue, 'pause')}>
                      <IconPlayerPause size={20} stroke={1.5} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </List.Actions>
            </tr>
          ))}
        </tbody>
      </Table>
      {qname && (
        <DeleteModal
          title={`Delete ${qname} queue`}
          action={`/queues/${qname}/delete`}
          opened={opened}
          onClose={close}
          text
        >
          Are you sure you want to delete the &quot;{qname}&quot; queue?
        </DeleteModal>
      )}
    </Paper>
  )
}
