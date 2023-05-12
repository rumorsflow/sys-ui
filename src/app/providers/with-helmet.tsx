import React from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'

import { APP_NAME_LONG, APP_NAME_TEMPLATE } from '@/config'

export const withHelmet = (component: () => React.ReactNode) => () =>
  (
    <HelmetProvider>
      <Helmet defaultTitle={APP_NAME_LONG} titleTemplate={APP_NAME_TEMPLATE} />
      {component()}
    </HelmetProvider>
  )
