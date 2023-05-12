import React from 'react'
import { AppShell } from '@mantine/core'

import { Protected, RouteOutlet } from '@/ui'

import { Navbar } from './navbar'

export const MainLayout: React.FC = () => (
  <Protected fa>
    <AppShell
      styles={(theme) => ({
        root: {
          height: '100vh',
        },
        main: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
      })}
      padding="sm"
      navbar={<Navbar />}
    >
      <RouteOutlet />
    </AppShell>
  </Protected>
)
