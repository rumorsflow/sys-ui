import React from 'react'
import { Container, createStyles, rem, Text, Title } from '@mantine/core'

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(80),
    paddingBottom: rem(80),
  },

  label: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: 200,
    lineHeight: 1,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],

    [theme.fn.smallerThan('sm')]: {
      fontSize: 120,
    },
  },

  title: {
    fontFamily: theme.fontFamily,
    textAlign: 'center',
    fontWeight: 900,
    fontSize: 32,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 32,
    },
  },

  description: {
    maxWidth: rem(500),
    margin: 'auto',
    marginTop: theme.spacing.xl,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
  },
}))

type WrapperProps = {
  status: number
  title: string
  message?: string
  fallback?: React.ReactNode
}

export const Wrapper: React.FC<WrapperProps> = ({ status, title, message, fallback }) => {
  const { classes } = useStyles()

  return (
    <Container className={classes.root}>
      <div className={classes.label}>{status}</div>
      <Title className={classes.title}>{title}</Title>
      {message ? (
        <Text color="dimmed" size="lg" align="center" className={classes.description}>
          {message}
        </Text>
      ) : (
        <>{fallback}</>
      )}
    </Container>
  )
}
