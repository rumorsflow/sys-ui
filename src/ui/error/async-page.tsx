import React from 'react'
import { useAsyncError } from 'react-router-dom'

import { Page } from './page'

export const AsyncPage: React.FC = () => {
  const error = useAsyncError() as { status: number }

  return <Page status={error.status} />
}
