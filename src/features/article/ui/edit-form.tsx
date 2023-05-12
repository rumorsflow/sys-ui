import React from 'react'

import { useAsyncValue } from '@/hooks'
import { Article } from '@/api'

import { Form } from './form'

export const EditForm: React.FC = () => {
  const article = useAsyncValue<Article>()

  return <Form method="patch" article={article} />
}
