import React, { CSSProperties } from 'react'
import { Group, Loader, useMantineTheme } from '@mantine/core'
import { MantineNumberSize } from '@mantine/styles'
import { SystemProp } from '@mantine/styles/lib/theme/types/MantineStyleSystem'

type DotsLoaderProps = {
  size?: MantineNumberSize
  w?: SystemProp<CSSProperties['width']>
  h?: SystemProp<CSSProperties['height']>
}

export const DotsLoader: React.FC<DotsLoaderProps> = ({ size = 'xl', w = '100%', h = '100%' }) => {
  const theme = useMantineTheme()

  return (
    <Group w={w} h={h} position="center" align="center">
      <Loader color={theme.colors.dark[3]} size={size} variant="dots" />
    </Group>
  )
}
