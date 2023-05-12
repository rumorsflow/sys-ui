import React from 'react'
import { Helmet } from 'react-helmet-async'

import { useTitles } from '@/hooks'

export const HelmetTitle: React.FC = () => {
  const titles = useTitles()

  if (!titles.length) {
    return <></>
  }

  return (
    <>
      {titles.map((title) => (
        <Helmet key={title} title={title} />
      ))}
    </>
  )
}
