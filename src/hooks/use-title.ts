import { useMemo } from 'react'
import { useLocation, useMatches } from 'react-router-dom'

import { useLoaded } from '@/store'
import { IconLinkProps } from '@/config'

type TitleFn = (data: unknown) => string

type RouteHandle = {
  title?: string | TitleFn
  links?: IconLinkProps[]
}

type Handle = {
  title: string
  links?: IconLinkProps[]
}

const isHandle = (handle: unknown): boolean => (handle as RouteHandle)?.title !== undefined

const getTitle = (title: string | TitleFn | undefined, data?: unknown) =>
  !title ? '' : typeof title === 'string' ? title : !data ? '' : title(data)

export const useTitles = () => {
  const matches = useMatches()
  const data = useLoaded((state) => state.data)

  return useMemo(
    () => matches.filter((m) => isHandle(m.handle)).map((m) => getTitle((m.handle as RouteHandle).title, data)),
    [matches, data]
  )
}

export const useHandle = (path?: string): Handle | undefined => {
  const matches = useMatches()
  const data = useLoaded((state) => state.data)
  const { pathname } = useLocation()

  return useMemo(() => {
    if (!matches.length) {
      return undefined
    }

    const p = path?.split('?')?.[0]
    const m = path === undefined ? matches[matches.length - 1] : matches.find((m) => m.pathname === p)

    if (!m || !isHandle(m.handle) || (!p && m.pathname !== pathname)) {
      return undefined
    }

    const h = m.handle as RouteHandle

    return {
      title: getTitle(h.title, data),
      links: h.links,
    }
  }, [matches, data, pathname, path])
}
