import React, { useMemo } from 'react'

import { useAsyncValue } from '@/hooks'
import { Page, Site } from '@/api'

import { Form } from './form'

const emptySites: Site[] = []

export const NewForm: React.FC = () => {
  const page = useAsyncValue<Page<Site>>()
  const sites = useMemo(() => page?.data ?? emptySites, [page?.data])

  return <Form method="post" sites={sites} />
}
