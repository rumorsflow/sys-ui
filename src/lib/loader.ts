import { LoaderFunction, LoaderFunctionArgs } from '@remix-run/router/utils'
import { defer, redirect } from 'react-router-dom'

import { APP_BASE_URL } from '@/config'
import { useAuth } from '@/store'
import { FetchResponse, Page } from '@/api'

import { searchParams } from './search-params'

type ListApiFn<T> = (params: URLSearchParams, signal?: AbortSignal) => Promise<FetchResponse<Page<T>>>

type ApiFn<T> = (id: string, signal?: AbortSignal) => Promise<FetchResponse<T>>

type Fn<T> = (signal?: AbortSignal) => Promise<FetchResponse<T>>

const last: { [key: string]: Promise<FetchResponse<Page>> } = {}

const isAuth = (requestURL: string) => {
  const state = useAuth.getState()

  if (!state.isAuth || !state.is2FA) {
    const url = new URL(requestURL)
    const referer = url.pathname.replace(APP_BASE_URL, '') + url.search

    throw redirect(`/sign-in${state.isAuth ? '/2fa' : ''}?referer=${encodeURIComponent(decodeURIComponent(referer))}`)
  }
}

export const listLoader =
  <T>(fn: ListApiFn<T>, path: string): LoaderFunction =>
  ({ request }: LoaderFunctionArgs) => {
    isAuth(request.url)

    if (last[path] === undefined || !request.url.includes(path)) {
      last[path] = fn(searchParams(request.url), request.signal)
    }

    return defer({ data: last[path] })
  }

export const oneLoader =
  <T>(fn: ApiFn<T>): LoaderFunction =>
  ({ request, params }: LoaderFunctionArgs) => {
    isAuth(request.url)

    return defer({
      data: fn(params.id as string, request.signal),
    })
  }

export const loader =
  <T>(fn: Fn<T>): LoaderFunction =>
  ({ request }: LoaderFunctionArgs) => {
    isAuth(request.url)

    return defer({
      data: fn(request.signal),
    })
  }
