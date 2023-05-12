import React from 'react'

import { useAsyncValue } from '@/hooks'
import { Page, Site } from '@/api'

import { Form } from './form'

const emptySites: Site[] = []

export const NewForm: React.FC = () => {
  const page = useAsyncValue<Page<Site>>()

  return <Form method="post" sites={page?.data ?? emptySites} />
}
