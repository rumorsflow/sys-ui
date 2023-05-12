import React from 'react'

import { TO_ARTICLES } from '@/config'
import { AwaiterPage } from '@/ui'

import { ArticleList } from '../ui/list'

export const ArticleListPage: React.FC = () => (
  <AwaiterPage path={TO_ARTICLES}>
    <ArticleList />
  </AwaiterPage>
)
