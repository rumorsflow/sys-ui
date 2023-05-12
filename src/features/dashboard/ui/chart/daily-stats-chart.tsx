import React from 'react'
import { Line, LineChart } from 'recharts'

import { DailyQueueStats } from '@/api'
import { useStats } from '@/store'

import { Chart } from './chart'

type ChartData = {
  succeeded: number
  failed: number
  date: string
}

type DailyStatsChartProps = {
  numDays: number
}

const makeChartData = (queueStats: DailyQueueStats, numDays: number): ChartData[] => {
  const dataByDate: { [date: string]: ChartData } = {}
  for (const qname in queueStats) {
    for (const stat of queueStats[qname]) {
      if (!dataByDate[stat.date]) {
        dataByDate[stat.date] = { succeeded: 0, failed: 0, date: stat.date }
      }
      dataByDate[stat.date].succeeded += stat.processed - stat.failed
      dataByDate[stat.date].failed += stat.failed
    }
  }

  return Object.values(dataByDate)
    .sort((x: ChartData, y: ChartData) => Date.parse(x.date) - Date.parse(y.date))
    .slice(-numDays)
}

export const DailyStatsChart = ({ numDays }: DailyStatsChartProps) => {
  const data = useStats((state) => makeChartData(state.dailyStats, numDays))

  return (
    <Chart component={LineChart} data={data} dataKey="date">
      {(theme) => (
        <>
          <Line type="monotone" dataKey="succeeded" stroke={theme.colors.teal[theme.fn.primaryShade()]} />
          <Line type="monotone" dataKey="failed" stroke={theme.colors.red[theme.fn.primaryShade()]} />
        </>
      )}
    </Chart>
  )
}
