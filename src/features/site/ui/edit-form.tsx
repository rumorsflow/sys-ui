import React from 'react'

import { useAsyncValue } from '@/hooks'
import { Site } from '@/api'

import { Form } from './form'

export const EditForm: React.FC = () => {
  const site = useAsyncValue<Site>()

  return <Form method="patch" site={site} />
}
