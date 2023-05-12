import { API_URL } from '@/config'
import { useStats } from '@/store'
import { DailyQueueStats, QueueInfo, SchedulerEntries, SchedulerEntry } from '@/api'

import { useSse, useSseListener } from './use-sse'

type StatsResponse = {
  queues?: QueueInfo[]
  daily_stats?: DailyQueueStats
  scheduler_entries?: SchedulerEntry[]
}

export const useSseStats = (params: URLSearchParams) => {
  const setStats = useStats((state) => state.set)
  const [sse, status] = useSse(`${API_URL}/realtime?${params.toString()}`, true)

  useSseListener(sse, ['stats'], (evt) => {
    const { queues, daily_stats, scheduler_entries } = JSON.parse(evt.data) as StatsResponse
    setStats({
      queues: queues?.sort((a, b) => a.queue.localeCompare(b.queue)),
      dailyStats: daily_stats,
      schedulerEntries: scheduler_entries?.reduce(
        (acc, cur) => ({
          ...acc,
          [cur.job_payload.job_id]: cur,
        }),
        {} as SchedulerEntries
      ),
    })
  })

  return status
}
