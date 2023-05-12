import React from 'react'
import { ScrollArea, SimpleGrid } from '@mantine/core'

import { useSseStats } from '@/hooks'
import { PageTitle } from '@/ui'

import { QueueSizeBox, QueuesTable, TasksProcessedBox } from './ui'

const params = new URLSearchParams('filter=queues,daily_stats')

export const DashboardPage: React.FC = () => {
  useSseStats(params)

  return (
    <>
      <PageTitle mb="sm" />
      <ScrollArea sx={{ flexGrow: 1 }} scrollbarSize={3} mr="-sm" mb="-sm" pr="sm" pb="sm">
        <SimpleGrid mb="sm" cols={2} spacing="sm" verticalSpacing="sm" breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
          <QueueSizeBox />
          <TasksProcessedBox />
        </SimpleGrid>
        <QueuesTable />
      </ScrollArea>
    </>
  )
}
