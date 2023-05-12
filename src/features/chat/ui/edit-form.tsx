import React, { useMemo } from 'react'

import { useAsyncValue } from '@/hooks'
import { Chat, Page, Site } from '@/api'

import { Form } from './form'

const emptySites: Site[] = []

export const EditForm: React.FC = () => {
  const [chat, page] = useAsyncValue<[Chat, Page<Site>]>()
  const sites = useMemo(() => page?.data ?? emptySites, [page?.data])

  return <Form method="patch" sites={sites} chat={chat} />
}
