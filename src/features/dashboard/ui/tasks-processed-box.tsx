import React, { useState } from 'react'
import { Box, Group, Paper, Popover, rem, SegmentedControl, Stack, Text, Title } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'

import { DailyStatsChart, ProcessedTasksChart } from './chart'

const periods = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7d', value: 'last-7d' },
  { label: 'Last 30d', value: 'last-30d' },
  { label: 'Last 90d', value: 'last-90d' },
]

export const TasksProcessedBox = () => {
  const [period, setPeriod] = useState('today')

  return (
    <Paper component={Stack} shadow="md" p="sm" miw={rem(600)} withBorder>
      <Group position="apart" align="flex-start" mb="sm" mih={rem(33)}>
        <Group align="flex-start" spacing="xs">
          <Title
            order={3}
            sx={(theme) => ({
              lineHeight: 1,
              color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
            })}
          >
            Tasks Processed
          </Title>
          <Popover width={280} position="bottom" withArrow shadow="md">
            <Popover.Target>
              <IconInfoCircle width={22} height={22} />
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="xs">Total number of tasks processed in a given day (UTC)</Text>
              <Text size="xs">
                <strong>Succeeded</strong>: number of tasks successfully processed
              </Text>
              <Text size="xs">
                <strong>Failed</strong>: number of tasks failed to be processed
              </Text>
            </Popover.Dropdown>
          </Popover>
        </Group>
        <SegmentedControl size="xs" data={periods} defaultValue="today" onChange={setPeriod} />
      </Group>
      <Box w="100%" h={400}>
        {period === 'today' && <ProcessedTasksChart />}
        {period === 'last-7d' && <DailyStatsChart numDays={7} />}
        {period === 'last-30d' && <DailyStatsChart numDays={30} />}
        {period === 'last-90d' && <DailyStatsChart numDays={90} />}
      </Box>
    </Paper>
  )
}
