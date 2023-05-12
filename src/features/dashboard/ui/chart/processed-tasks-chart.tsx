import React from 'react'
import { Bar } from 'recharts'

import { useStats } from '@/store'

import { Chart } from './chart'

export const ProcessedTasksChart = () => {
  const queues = useStats((state) =>
    state.queues.map((q) => ({
      queue: q.queue,
      succeeded: q.processed - q.failed,
      failed: q.failed,
    }))
  )

  return (
    <Chart data={queues}>
      {(theme) => (
        <>
          <Bar dataKey="succeeded" stackId="a" fill={theme.colors.teal[theme.fn.primaryShade()]} />
          <Bar dataKey="failed" stackId="a" fill={theme.colors.red[theme.fn.primaryShade()]} />
        </>
      )}
    </Chart>
  )
}
