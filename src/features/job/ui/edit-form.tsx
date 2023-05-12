import React from 'react'

import { useAsyncValue } from '@/hooks'
import { Job, Page, Site } from '@/api'

import { Form } from './form'
import { TimeBanner } from './time-banner'

const emptySites: Site[] = []

export const EditForm: React.FC = () => {
  const [job, page] = useAsyncValue<[Job, Page<Site>]>()

  return (
    <>
      <TimeBanner job={job} />
      <Form method="patch" sites={page?.data ?? emptySites} job={job} />
    </>
  )
}
