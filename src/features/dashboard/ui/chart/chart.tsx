import React from 'react'
import { Box, createStyles, useMantineTheme } from '@mantine/core'
import { MantineTheme } from '@mantine/styles/lib/theme/types'
import { CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart } from 'recharts'

const useStyles = createStyles((theme) => ({
  chart: {
    '& > *:focus-visible': {
      outline: 'none !important',
    },
  },

  label: {
    color: theme.colors.dark[theme.fn.primaryShade()],
    fontSize: theme.fontSizes.md,
    fontWeight: 500,
  },

  content: {
    borderRadius: theme.radius.sm,
    border: 0,
    outline: 'none !important',
  },
}))

type ChartProps<T = unknown> = {
  data: T[]
  dataKey?: string
  component?: any // eslint-disable-line
  children?: (theme: MantineTheme) => React.ReactNode
  maxBarSize?: number
}

export function Chart<T = unknown>({
  data,
  dataKey = 'queue',
  component = BarChart,
  children = () => <></>,
  maxBarSize = 80,
}: ChartProps<T>) {
  const theme = useMantineTheme()
  const { classes } = useStyles()

  return (
    <ResponsiveContainer>
      <Box component={component} data={data} maxBarSize={maxBarSize} className={classes.chart}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.gray[4]} />
        <XAxis dataKey={dataKey} stroke={theme.colors.orange[theme.fn.primaryShade()]} />
        <YAxis stroke={theme.colors.orange[theme.fn.primaryShade()]} />
        <Tooltip
          cursor={{ fill: 'rgba(100, 100, 100, 0.3)' }}
          labelClassName={classes.label}
          wrapperClassName={classes.content}
        />
        <Legend />
        {children(theme)}
      </Box>
    </ResponsiveContainer>
  )
}
