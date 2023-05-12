import React, { useMemo } from 'react'
import { Badge, List, ThemeIcon, useMantineTheme } from '@mantine/core'
import { IconCalendarX, IconCircleKey, IconMessageCircle } from '@tabler/icons-react'

import { ChatRights } from '@/api'
import { formatDateTime } from '@/lib'

type RightsProps = {
  rights: ChatRights
}

export const Rights: React.FC<RightsProps> = ({ rights }) => {
  const theme = useMantineTheme()

  const data = useMemo(() => Object.entries(rights), [rights])

  return (
    <List size="md" spacing="sm" center>
      {data.map(([prop, value]) => (
        <React.Fragment key={prop}>
          {prop === 'status' ? (
            <List.Item
              icon={
                <ThemeIcon size={24} radius="xl">
                  <IconMessageCircle size="1rem" />
                </ThemeIcon>
              }
            >
              <Badge radius="sm" size="lg" variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }}>
                {value}
              </Badge>
            </List.Item>
          ) : (
            <>
              {prop === 'until_date' ? (
                <List.Item
                  icon={
                    <ThemeIcon color={theme.colors.red[theme.fn.primaryShade()]} size={24} radius="xl">
                      <IconCalendarX size="1rem" />
                    </ThemeIcon>
                  }
                >
                  {formatDateTime(new Date((value as number) * 1000))}
                </List.Item>
              ) : (
                <List.Item
                  icon={
                    <ThemeIcon
                      color={theme.colors[value ? 'teal' : 'red'][theme.fn.primaryShade()]}
                      size={24}
                      radius="xl"
                    >
                      <IconCircleKey size="1rem" />
                    </ThemeIcon>
                  }
                >
                  {prop[0].toUpperCase()}
                  {prop.slice(1).replaceAll('_', ' ')}
                </List.Item>
              )}
            </>
          )}
        </React.Fragment>
      ))}
    </List>
  )
}
