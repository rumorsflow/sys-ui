import { useCallback, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const useSortTable = <T extends object>() => {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const params = useMemo(() => new URLSearchParams(search), [search])

  const field = params.has('sort')
    ? (params.get('sort')?.at(0) === '-'
        ? (params.get('sort')?.substring(1) as keyof T)
        : (params.get('sort') as keyof T)) ?? null
    : null
  const [sortBy, setSortBy] = useState<keyof T | null>(field)
  const [reverseSortDirection, setReverseSortDirection] = useState(params.get('sort')?.at(0) === '-')

  const setSorting = useCallback(
    (field: keyof T) => {
      const reversed = field === sortBy ? !reverseSortDirection : false
      setReverseSortDirection(reversed)
      setSortBy(field)
      params.set('sort', `${reversed ? '-' : ''}${field as string}`)
      navigate(`${pathname}?${params.toString()}`)
    },
    [navigate, params, pathname, reverseSortDirection, sortBy]
  )

  return useMemo(() => ({ setSorting, reverseSortDirection, sortBy }), [reverseSortDirection, setSorting, sortBy])
}
