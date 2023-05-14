import React, { useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  createStyles,
  ScrollArea,
  Navbar as BaseNavbar,
  Box,
  UnstyledButton,
  useMantineColorScheme,
  Text,
  rem,
} from '@mantine/core'
import { IconLogout, IconMoonStars, IconSun } from '@tabler/icons-react'

import { APP_NAME_SHORT, navbarLinks } from '@/config'
import { useAuth } from '@/store'

const useStyles = createStyles((theme) => {
  const variant = theme.fn.variant({ variant: 'light', color: theme.primaryColor })

  return {
    header: {
      position: 'relative',
      padding: theme.spacing.xs,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    footer: {
      padding: theme.spacing.xs,
      marginTop: theme.spacing.xs,
      borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },

    logo: {
      fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
      fontWeight: 900,
      fontSize: rem(24),
      letterSpacing: rem(3),
      color: 'transparent',
      backgroundClip: 'text',
      backgroundImage:
        theme.colorScheme === 'dark'
          ? theme.fn.linearGradient(45, theme.colors.dark[1], theme.colors.dark[2], theme.colors.dark[1])
          : theme.fn.linearGradient(45, theme.colors.dark[3], theme.colors.dark[4], theme.colors.dark[3]),
    },

    links: {
      display: 'flex',
      alignItems: 'center',
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
      padding: theme.spacing.xs,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
      },
    },

    active: {
      '&, &:hover': {
        backgroundColor: variant.background,
        color: variant.color,
      },
    },
  }
})

export const Navbar: React.FC = () => {
  const { pathname } = useLocation()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const { classes, cx } = useStyles()

  const isActive = useCallback(
    (to: string) => {
      to = to.split('?')[0]

      return to === pathname || (to !== '/' && pathname.startsWith(to))
    },
    [pathname]
  )

  const logout = useAuth((state) => state.logout)

  return (
    <BaseNavbar width={{ base: 66 }}>
      <BaseNavbar.Section className={classes.header}>
        <Box component={Link} to="/" td="none">
          <Text className={classes.logo}>{APP_NAME_SHORT}</Text>
        </Box>
      </BaseNavbar.Section>
      <BaseNavbar.Section
        className={classes.links}
        component={ScrollArea}
        scrollbarSize={3}
        offsetScrollbars
        grow
        px="xs"
      >
        {navbarLinks.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            title={item.label}
            className={cx(classes.link, { [classes.active]: isActive(item.to) })}
          >
            <item.icon stroke={1.5} />
          </Link>
        ))}
      </BaseNavbar.Section>
      <BaseNavbar.Section className={classes.footer}>
        <UnstyledButton className={classes.link} onClick={() => toggleColorScheme()} title="Ctrl + J">
          {colorScheme === 'dark' ? <IconSun stroke={1.5} /> : <IconMoonStars stroke={1.5} />}
        </UnstyledButton>
        <UnstyledButton className={classes.link} onClick={logout}>
          <IconLogout stroke={1.5} />
        </UnstyledButton>
      </BaseNavbar.Section>
    </BaseNavbar>
  )
}
