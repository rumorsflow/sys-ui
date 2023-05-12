import React from 'react'

import { TO_SITES } from '@/config'
import { AwaiterPage } from '@/ui'

import { SiteList } from '../ui/list'

export const SiteListPage: React.FC = () => (
  <AwaiterPage path={TO_SITES}>
    <SiteList />
  </AwaiterPage>
)
