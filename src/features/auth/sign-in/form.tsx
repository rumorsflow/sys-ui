import React, { useCallback } from 'react'
import { Form, useSubmit } from 'react-router-dom'
import * as yup from 'yup'
import { Button, LoadingOverlay, Paper, PasswordInput, TextInput, Title } from '@mantine/core'

import { useForm } from '@/hooks'
import { toForm } from '@/lib'

const vUsername = yup.string().required('Username is required')

const vPassword = yup
  .string()
  .required('Password is required')
  .min(8, 'Password is too short')
  .max(64, 'Password is too long')
// .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w\s\-^$&*!@#]{8,64}$/, 'Password field must be a valid password')

const schema = yup.object({ username: vUsername, password: vPassword }).required()

const initialValues = {
  username: '',
  password: '',
}

export const SignInForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    disabled,
    isLoading,
  } = useForm<typeof initialValues>(schema, initialValues)

  const submit = useSubmit()

  const onSubmit = useCallback(
    (data: typeof initialValues) => {
      submit(toForm(data), { method: 'post' })
    },
    [submit]
  )

  return (
    <Paper
      component={Form}
      onSubmit={handleSubmit(onSubmit)}
      shadow="md"
      radius="md"
      p={24}
      w={{ base: 320, xs: 420 }}
      sx={{ position: 'relative' }}
      withBorder
    >
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      <Title order={2} align="center" mb={24}>
        Sign in
      </Title>
      <TextInput
        label="Username"
        placeholder="Your username"
        size="md"
        error={errors.username?.message}
        {...register('username')}
        withAsterisk
      />
      <PasswordInput
        label="Password"
        placeholder="Your password"
        mt="md"
        size="md"
        error={errors.password?.message}
        {...register('password')}
        withAsterisk
      />
      <Button type="submit" mt="xl" size="md" disabled={disabled} fullWidth>
        Sign in
      </Button>
    </Paper>
  )
}
