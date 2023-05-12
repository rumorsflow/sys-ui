import React from 'react'
import { Flex } from '@mantine/core'

import { SignInForm } from './form'

export const SignInPage: React.FC = () => (
  <Flex justify="center" align="center" h="100vh">
    <SignInForm />
  </Flex>
)
