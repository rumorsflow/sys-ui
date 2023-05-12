import React, { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Drawer } from '@mantine/core'
import { MantineNumberSize } from '@mantine/styles'
import { DrawerPosition } from '@mantine/core/lib/Drawer/DrawerRoot/DrawerRoot'

import { useHandle } from '@/hooks'

import { RouteOutlet } from '.'

type DrawerOutletProps = {
  toClose: string
  position?: DrawerPosition
  size?: MantineNumberSize
}

export const DrawerOutlet: React.FC<DrawerOutletProps> = ({ toClose, position = 'right', size = 'lg' }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const opened = useMemo(() => pathname.split('/').length > 2, [pathname])

  const onClose = useCallback(() => {
    navigate(toClose)
  }, [navigate, toClose])

  const handle = useHandle()

  return (
    <Drawer
      title={handle?.title}
      position={position}
      size={size}
      opened={opened}
      onClose={onClose}
      padding="sm"
      overlayProps={{ opacity: 0.55, blur: 3 }}
      styles={(theme) => ({
        root: {
          overflow: 'hidden',
        },
        header: {
          gap: theme.spacing.sm,
        },
        title: {
          fontWeight: 500,

          [`@media (min-width: ${theme.breakpoints.sm})`]: {
            fontSize: theme.fontSizes.lg,
          },
        },
        close: {
          [`@media (min-width: ${theme.breakpoints.sm})`]: {
            width: '1.75rem',
            minWidth: '1.75rem',
            height: '1.75rem',
            minHeight: '1.75rem',

            '& svg': {
              width: '1.25rem !important',
              height: '1.25rem !important',
            },
          },
        },
        body: {
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 52px)',
          overflow: 'auto',
        },
      })}
    >
      <RouteOutlet />
    </Drawer>
  )
}
