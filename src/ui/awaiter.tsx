import React, { CSSProperties } from 'react'
import { Await } from 'react-router-dom'
import { SystemProp } from '@mantine/styles/lib/theme/types/MantineStyleSystem'

import { useLoaderData } from '@/hooks'

import { DotsLoader } from './dots-loader'
import { AsyncErrorPage } from './error'
import { PageTitle } from './title'
import { DrawerOutlet } from './outlet'

type AwaiterProps = {
  children: React.ReactNode
  w?: SystemProp<CSSProperties['width']>
  h?: SystemProp<CSSProperties['height']>
}

export const Awaiter: React.FC<AwaiterProps> = ({ children, w, h }) => {
  const data = useLoaderData()

  return (
    <React.Suspense fallback={<DotsLoader w={w} h={h} />}>
      <Await resolve={data} errorElement={<AsyncErrorPage />}>
        {children}
      </Await>
    </React.Suspense>
  )
}

type AwaiterPageProps = {
  children: React.ReactNode
  path: string
}

export const AwaiterPage: React.FC<AwaiterPageProps> = ({ children, path }) => (
  <>
    <PageTitle path={path} mb="sm" />
    <Awaiter>{children}</Awaiter>
    <DrawerOutlet toClose={path} />
  </>
)
