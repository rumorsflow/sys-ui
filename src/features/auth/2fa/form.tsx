import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigation, useSubmit } from 'react-router-dom'
import { Button, Group, LoadingOverlay, Paper, Title, PinInput } from '@mantine/core'
import { IconLogout } from '@tabler/icons-react'

import { useAuth } from '@/store'

export const TwoFaForm: React.FC = () => {
  const { state } = useNavigation()
  const submit = useSubmit()
  const submitted = useRef(false)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const isLoading = useMemo(() => state !== 'idle', [state])

  const logout = useAuth((state) => state.logout)

  const onChange = useCallback(
    (code: string) => {
      setValue(code)
      setError(false)

      if (code.length === 6) {
        submitted.current = true
        submit({ code }, { method: 'post' })
      }
    },
    [submit]
  )

  useEffect(() => {
    if (submitted.current && !isLoading) {
      submitted.current = false
      setError(true)
      setValue('')
    }
  }, [isLoading])

  return (
    <Paper shadow="md" radius="md" p="lg" w={{ base: 320, xs: 420 }} sx={{ position: 'relative' }} withBorder>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      <Title order={2} align="center">
        Two-factor authentication
      </Title>
      <Group position="center" my="xl">
        <PinInput
          type="number"
          length={6}
          error={error}
          value={value}
          onChange={onChange}
          size="md"
          spacing="sm"
          autoFocus
          manageFocus
        />
      </Group>
      <Button size="md" leftIcon={<IconLogout stroke={1.5} />} fullWidth onClick={logout}>
        Logout
      </Button>
    </Paper>
  )
}
