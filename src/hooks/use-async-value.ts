import { useEffect } from 'react'
import { useAsyncValue as useBaseAsyncValue } from 'react-router-dom'

import { useLoaded } from '@/store'

export const useAsyncValue = <T = unknown>() => {
  const { data } = useBaseAsyncValue() as { data: T }
  const { set, unset } = useLoaded((state) => ({ set: state.set, unset: state.unset }))

  useEffect(() => {
    set(data)

    return () => {
      unset()
    }
  }, [data, set, unset])

  return data
}
