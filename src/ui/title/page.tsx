import React from 'react'
import { Link } from 'react-router-dom'
import { ActionIcon, Group, Title, Tooltip } from '@mantine/core'
import { GroupProps } from '@mantine/core/lib/Group/Group'

import { useHandle } from '@/hooks'

type PageTitleProps = Omit<GroupProps, 'position' | 'align' | 'children'> & {
  path?: string
}

export const PageTitle: React.FC<PageTitleProps> = ({ path, ...rest }) => {
  const handle = useHandle(path)

  if (!handle) {
    return <></>
  }

  const { title, links } = handle

  return (
    <Group position="apart" align="center" {...rest}>
      <Title order={1} sx={{ lineHeight: 1 }}>
        {title}
      </Title>
      {links && links.length > 0 && (
        <Group position="right" align="center" spacing="sm">
          {links.map((link) => (
            <Tooltip key={link.label} label={link.label} position="left">
              <ActionIcon variant="default" size={32} component={Link} to={link.to}>
                <link.icon />
              </ActionIcon>
            </Tooltip>
          ))}
        </Group>
      )}
    </Group>
  )
}
