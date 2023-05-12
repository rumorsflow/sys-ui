import React from 'react'
import { Bar } from 'recharts'

import { useStats } from '@/store'

import { Chart } from './chart'

export const QueuesChart = () => {
  const queues = useStats((state) => state.queues)

  return (
    <Chart data={queues}>
      {(theme) => (
        <>
          <Bar dataKey="active" stackId="a" fill={theme.colors.indigo[theme.fn.primaryShade()]} />
          <Bar dataKey="pending" stackId="a" fill={theme.colors.blue[theme.fn.primaryShade()]} />
          <Bar dataKey="aggregating" stackId="a" fill={theme.colors.grape[theme.fn.primaryShade()]} />
          <Bar dataKey="scheduled" stackId="a" fill={theme.colors.yellow[theme.fn.primaryShade()]} />
          <Bar dataKey="retry" stackId="a" fill={theme.colors.red[theme.fn.primaryShade()]} />
          <Bar dataKey="archived" stackId="a" fill={theme.colors.pink[theme.fn.primaryShade()]} />
          <Bar dataKey="completed" stackId="a" fill={theme.colors.teal[theme.fn.primaryShade()]} />
        </>
      )}
    </Chart>
  )
}
