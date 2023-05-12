import React from 'react'
import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom'

import { useAuth } from '@/store'

type ProtectedProps = {
  children?: React.ReactNode
  fa?: boolean
}

const r = 'referer'

export const Protected: React.FC<ProtectedProps> = ({ children, fa }) => {
  const [searchParams] = useSearchParams()
  const { pathname } = useLocation()
  const { isAuth, is2FA } = useAuth((state) => ({ isAuth: state.isAuth, is2FA: state.is2FA }))

  if (!isAuth || (fa && !is2FA)) {
    const ref = decodeURIComponent(searchParams.get(r) ?? '')
    const q = searchParams.toString()
    const query = !ref ? (!q ? pathname : `${pathname}?${q}`) : ref

    return <Navigate to={`/sign-in${isAuth ? '/2fa' : ''}?${r}=${encodeURIComponent(query)}`} />
  }

  if (isAuth && is2FA) {
    const referer = searchParams.get(r)

    if (referer || !fa) {
      return <Navigate to={decodeURIComponent(referer ?? '/')} replace />
    }
  }

  if (children) {
    return <>{children}</>
  }

  return <Outlet />
}
