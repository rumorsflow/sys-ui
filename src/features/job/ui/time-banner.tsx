import React from 'react'
import { Alert, SimpleGrid, Text, Title } from '@mantine/core'

import { Job } from '@/api'
import { useStats } from '@/store'
import { durationBefore, timeAgo } from '@/lib'

type TimeBannerProps = {
  job: Job
}

export const TimeBanner: React.FC<TimeBannerProps> = ({ job }) => {
  const entry = useStats((state) => state.schedulerEntries[job.id])

  if (!entry) {
    return <></>
  }

  return (
    <Alert color="orange" p="xs" mb="sm" sx={{ overflow: 'unset' }}>
      <SimpleGrid cols={2} spacing="xs" verticalSpacing="xs">
        <Title order={6}>Next Enqueue</Title>
        <Title order={6}>Prev Enqueue</Title>
        <Text size="sm">{entry ? durationBefore(entry.next_enqueue_at) : 'N/A'}</Text>
        <Text size="sm">{entry?.prev_enqueue_at ? timeAgo(entry.prev_enqueue_at) : 'N/A'}</Text>
      </SimpleGrid>
    </Alert>
  )
}
