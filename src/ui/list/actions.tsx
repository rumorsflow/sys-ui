import React from 'react'
import { ActionIcon, Group, Tooltip } from '@mantine/core'
import { Link } from 'react-router-dom'
import { IconPencil, IconTrash } from '@tabler/icons-react'

type ActionsProps = {
  className?: string
  editLink?: string
  onDelete?: () => void
  children?: React.ReactNode
}

export const Actions: React.FC<ActionsProps> = ({ children, className = '', editLink, onDelete }) => (
  <td>
    <Group className={className} spacing={5} position="right" noWrap>
      {children}
      {editLink && (
        <Tooltip label="Edit" position="left">
          <ActionIcon component={Link} to={editLink}>
            <IconPencil size={20} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip label="Delete" position="left">
          <ActionIcon color="red" onClick={onDelete}>
            <IconTrash size={20} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      )}
    </Group>
  </td>
)
