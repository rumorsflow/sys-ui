import React from 'react'

import { TO_JOBS } from '@/config'
import { useSseStats } from '@/hooks'
import { AwaiterPage } from '@/ui'

import { JobList } from '../ui/list'

const params = new URLSearchParams('filter=scheduler_entries')

export const JobListPage: React.FC = () => {
  useSseStats(params)

  return (
    <AwaiterPage path={TO_JOBS}>
      <JobList />
    </AwaiterPage>
  )
}
