import React from 'react'
import { useRouteError } from 'react-router-dom'

import { Page } from './page'

export const RoutePage: React.FC = () => {
  const error = useRouteError() as { status: number }

  return <Page status={error.status} />
}
