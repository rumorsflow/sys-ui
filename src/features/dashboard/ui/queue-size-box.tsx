import React from 'react'
import { Box, Group, Paper, Popover, rem, Stack, Text, Title } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'

import { QueuesChart } from './chart'

export const QueueSizeBox = () => (
  <Paper component={Stack} shadow="md" p="sm" miw={rem(600)} withBorder>
    <Group align="flex-start" spacing="xs" mb="sm" mih={rem(33)}>
      <Title
        order={3}
        sx={(theme) => ({
          lineHeight: 1,
          color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        })}
      >
        Queue Size
      </Title>
      <Popover width={280} position="bottom" withArrow shadow="md">
        <Popover.Target>
          <IconInfoCircle width={22} height={22} />
        </Popover.Target>
        <Popover.Dropdown>
          <Text size="xs">Total number of tasks in the queue</Text>
          <Text size="xs">
            <strong>Active</strong>: number of tasks currently being processed
          </Text>
          <Text size="xs">
            <strong>Pending</strong>: number of tasks ready to be processed
          </Text>
          <Text size="xs">
            <strong>Scheduled</strong>: number of tasks scheduled to be processed in the future
          </Text>
          <Text size="xs">
            <strong>Retry</strong>: number of tasks scheduled to be retried in the future
          </Text>
          <Text size="xs">
            <strong>Archived</strong>: number of tasks exhausted their retries
          </Text>
        </Popover.Dropdown>
      </Popover>
    </Group>
    <Box w="100%" h={400}>
      <QueuesChart />
    </Box>
  </Paper>
)
