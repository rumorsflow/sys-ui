import { FetchArgs, fetchFn } from '@/api/fetch'

export type ApiFetchArgs = Omit<FetchArgs, 'method' | 'body'>

export const getApi = <T = unknown>(
  path: string,
  { params, ...args }: ApiFetchArgs & { params?: URLSearchParams } = {}
) => fetchFn<T>(params ? `${path}?${params.toString()}` : path, { ...args, method: 'GET' })

export const createApi = <T = unknown>(path: string, request: T, args: ApiFetchArgs = {}) =>
  fetchFn(path, {
    ...args,
    method: 'POST',
    body: JSON.stringify(request),
  })

export const updateApi = <T = unknown>(path: string, request: T, args: ApiFetchArgs = {}) =>
  fetchFn(path, {
    ...args,
    method: 'PATCH',
    body: JSON.stringify(request),
  })

export const deleteApi = (path: string, args: ApiFetchArgs = {}) => fetchFn(path, { ...args, method: 'DELETE' })

export * from './types'
export * from './fetch'
export * from './auth'
export * from './site'
export * from './chat'
export * from './job'
export * from './article'
export * from './queue'
