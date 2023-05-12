import { useLocation, useNavigate } from 'react-router-dom'
import { useCallback, useMemo, useRef } from 'react'

import { APP_PER_PAGE } from '@/config'

export const usePagination = (totalItems: number) => {
  const { pathname, search } = useLocation()
  const params = useMemo(() => new URLSearchParams(search), [search])
  const navigate = useNavigate()
  const viewportRef = useRef<HTMLDivElement>(null)

  let size = +(params.get('size') ?? '0')
  if (size <= 0) {
    size = APP_PER_PAGE
  }

  const total = Math.ceil(totalItems / size)

  let page = +(params.get('page') ?? '1')
  if (page < 1) {
    page = 1
  }
  if (page > total) {
    page = total
  }

  const onChange = useCallback(
    (value: number) => {
      params.set('page', `${value}`)
      navigate(`${pathname}?${params.toString()}`)
      viewportRef.current?.scrollTo({ top: 0 })
    },
    [navigate, pathname, params]
  )

  return useMemo(() => ({ total, page, onChange, viewportRef }), [onChange, page, total])
}
