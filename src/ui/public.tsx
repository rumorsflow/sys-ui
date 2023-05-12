import React from 'react'
import { Navigate, Outlet, useSearchParams } from 'react-router-dom'

import { useAuth } from '@/store'

type PublicProps = {
  children?: React.ReactNode
}

export const Public: React.FC<PublicProps> = ({ children }) => {
  const [searchParams] = useSearchParams()
  const { isAuth } = useAuth((state) => ({ isAuth: state.isAuth }))

  if (isAuth) {
    return <Navigate to={decodeURIComponent(searchParams.get('referer') ?? '/')} replace />
  }

  if (children) {
    return <>{children}</>
  }

  return <Outlet />
}
