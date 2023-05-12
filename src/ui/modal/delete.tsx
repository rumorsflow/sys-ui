import React, { useCallback } from 'react'
import { useFormAction, useSubmit } from 'react-router-dom'
import { Button, Group, Modal, useMantineTheme, Text } from '@mantine/core'

type DeleteModalProps = {
  text?: boolean
  children: React.ReactNode
  title?: React.ReactNode
  action: string
  opened: boolean
  onClose: () => void
}

export const DeleteModal: React.FC<DeleteModalProps> = ({ text, title, children, action, opened, onClose }) => {
  const theme = useMantineTheme()
  const submit = useSubmit()
  const formAction = useFormAction(action)

  const onDelete = useCallback(() => {
    onClose()
    submit({}, { action: formAction, method: 'delete' })
  }, [onClose, submit, formAction])

  return (
    <Modal
      size="lg"
      overlayProps={{
        color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
        opacity: 0.55,
        blur: 3,
      }}
      zIndex={400}
      opened={opened}
      onClose={onClose}
      title={title}
    >
      {!text ? (
        children
      ) : (
        <Text size="sm" mb="sm" weight={500}>
          {children}
        </Text>
      )}
      <Group position="right" align="flex-end">
        <Button variant="subtle" onClick={onClose}>
          Cancel
        </Button>
        <Button color="red" variant="outline" onClick={onDelete}>
          OK
        </Button>
      </Group>
    </Modal>
  )
}
