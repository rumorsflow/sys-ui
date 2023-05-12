import React, { CSSProperties } from 'react'
import { Outlet } from 'react-router-dom'
import { SystemProp } from '@mantine/styles/lib/theme/types/MantineStyleSystem'

import { DotsLoader } from '@/ui'

type RouteOutletProps = {
  w?: SystemProp<CSSProperties['width']>
  h?: SystemProp<CSSProperties['height']>
}

export const RouteOutlet: React.FC<RouteOutletProps> = ({ w, h }) => (
  <React.Suspense fallback={<DotsLoader w={w} h={h} />}>
    <Outlet />
  </React.Suspense>
)
