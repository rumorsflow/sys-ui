import React, { useMemo } from 'react'
import { createStyles, Group, UnstyledButton, Text, Center, Box } from '@mantine/core'
import { IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react'
import { Sx } from '@mantine/styles/lib/theme/types/DefaultProps'

const useStyles = createStyles((theme) => ({
  th: {
    padding: '0 !important',
  },

  control: {
    width: '100%',
    padding: `${theme.spacing.xs}`,
  },

  controlHover: {
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  text: {
    whiteSpace: 'nowrap',
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}))

type ThProps = {
  children: React.ReactNode
  sx?: Sx | (Sx | undefined)[]
  className?: string
  sorted?: boolean
  reversed?: boolean
  onSort?: () => void
}

export const Th: React.FC<ThProps> = ({ children, className, sx, reversed = false, sorted = false, onSort }) => {
  const { classes, cx } = useStyles()

  const btn = useMemo(
    () =>
      onSort ? (
        <UnstyledButton onClick={onSort} className={cx(classes.control, classes.controlHover)}>
          <Group position="apart" noWrap>
            <Text weight={600} size="sm" className={classes.text}>
              {children}
            </Text>
            <Center className={classes.icon}>
              {sorted ? (
                reversed ? (
                  <IconChevronUp size={16} />
                ) : (
                  <IconChevronDown size={16} />
                )
              ) : (
                <IconSelector size={16} />
              )}
            </Center>
          </Group>
        </UnstyledButton>
      ) : (
        <Group className={classes.control} noWrap>
          <Text weight={600} size="sm" className={classes.text}>
            {children}
          </Text>
        </Group>
      ),
    [children, classes.control, classes.controlHover, classes.icon, classes.text, cx, onSort, reversed, sorted]
  )

  return (
    <Box component="th" className={cx(classes.th, className)} sx={sx}>
      {btn}
    </Box>
  )
}
