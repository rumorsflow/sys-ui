import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { DailyQueueStats, QueueInfo, SchedulerEntries } from '@/api'

export type Stats = {
  queues?: QueueInfo[]
  dailyStats?: DailyQueueStats
  schedulerEntries?: SchedulerEntries
}

export type StatsState = Required<Stats> & {
  set: (stats: Stats) => void
  setPause: (qname: string, pause: boolean) => void
}

export const useStats = create<StatsState>()(
  devtools((set, get) => ({
    queues: [],
    dailyStats: {},
    schedulerEntries: {},
    set: ({ queues, dailyStats, schedulerEntries }: Stats) =>
      set(() => {
        const old = get()

        return {
          queues: queues ?? old.queues,
          dailyStats: dailyStats ?? old.dailyStats,
          schedulerEntries: schedulerEntries ?? old.schedulerEntries,
        }
      }),
    setPause: (qname: string, pause: boolean) =>
      set(() => {
        const old = get()

        return { queues: old.queues.map((q) => (q.queue === qname ? { ...q, pause } : q)) }
      }),
  }))
)
