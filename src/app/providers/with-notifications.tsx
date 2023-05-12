import React from 'react'
import { Notifications } from '@mantine/notifications'

export const withNotifications = (component: () => React.ReactNode) => () =>
  (
    <>
      <Notifications position="bottom-right" />
      {component()}
    </>
  )
