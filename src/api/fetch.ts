import { Mutex } from 'async-mutex'

import { API_URL } from '@/config'
import { useAuth } from '@/store'

import { Session } from '.'

const validateStatus = (response: Response) => response.status >= 200 && response.status <= 299

const handleResponse = async (response: Response) => {
  const text = await response.text()

  return text.length ? JSON.parse(text) : null
}

export type FetchArgs = RequestInit & {
  timeout?: number
  prepareHeaders?: (headers: Headers) => Promise<Headers | void>
}

export type FetchError =
  | {
      status: number
      data: unknown
    }
  | {
      status: 'FETCH_ERROR'
      data?: undefined
      error: string
    }
  | {
      status: 'PARSING_ERROR'
      originalStatus: number
      data: string
      error: string
    }
  | {
      status: 'TIMEOUT_ERROR'
      data?: undefined
      error: string
    }
  | {
      status: 'CUSTOM_ERROR'
      data?: unknown
      error: string
    }

export type FetchResponse<T = unknown, M = { response: Response; id?: string }> =
  | {
      error: FetchError
      data?: undefined
      meta?: M
    }
  | {
      error?: undefined
      data: T
      meta?: M
    }

export const baseFetchFn = async <T = unknown>(
  path: string,
  { timeout, signal, headers, prepareHeaders = (x) => Promise.resolve(x), ...args }: FetchArgs = {}
): Promise<FetchResponse<T>> => {
  const controller = new AbortController()
  const internalSignal = controller.signal

  const handler = () => {
    controller.abort(signal?.reason)
  }

  signal?.addEventListener('abort', handler)

  let response,
    timedOut = false

  const timeoutId =
    timeout &&
    setTimeout(() => {
      timedOut = true
      controller.abort('TIMEOUT_ERROR')
    }, timeout)

  headers = new Headers(headers)
  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')
  headers = (await prepareHeaders(headers)) || headers

  try {
    response = await fetch(path.startsWith('/') ? `${API_URL}${path}` : path, {
      ...args,
      headers,
      signal: internalSignal,
    })
  } catch (e) {
    return {
      error: {
        status: timedOut ? 'TIMEOUT_ERROR' : 'FETCH_ERROR',
        error: String(e),
      },
    }
  } finally {
    signal?.removeEventListener('abort', handler)

    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }

  const responseClone = response.clone()
  const meta = { response: responseClone }

  let resultData: unknown
  let responseText = ''
  try {
    let handleResponseError
    await Promise.all([
      handleResponse(response).then(
        (r) => (resultData = r),
        (e) => (handleResponseError = e)
      ),
      // see https://github.com/node-fetch/node-fetch/issues/665#issuecomment-538995182
      responseClone.text().then(
        (r) => (responseText = r),
        () => {
          // ignore
        }
      ),
    ])
    if (handleResponseError) {
      throw handleResponseError
    }
  } catch (e) {
    return {
      error: {
        status: 'PARSING_ERROR',
        originalStatus: response.status,
        data: responseText,
        error: String(e),
      },
      meta,
    }
  }

  return validateStatus(response)
    ? {
        data: resultData as T,
        meta: {
          ...meta,
          id: response.status === 201 ? response.headers.get('location')?.split('/').pop() : undefined,
        },
      }
    : {
        error: {
          status: response.status,
          data: resultData,
        },
        meta,
      }
}

export type RefreshArgs = {
  refreshToken: (args: FetchArgs) => Promise<boolean>
}

const mutex = new Mutex()

export const reAuthFetchFn =
  ({ refreshToken }: RefreshArgs) =>
  async <T = unknown>(path: string, { prepareHeaders, ...args }: FetchArgs = {}) => {
    await mutex.waitForUnlock()

    let result = await baseFetchFn<T>(path, { prepareHeaders, ...args })

    if (result.error?.status === 401) {
      if (mutex.isLocked()) {
        await mutex.waitForUnlock()

        result = await baseFetchFn<T>(path, { prepareHeaders, ...args })
      } else {
        const release = await mutex.acquire()

        try {
          if (await refreshToken(args)) {
            result = await baseFetchFn<T>(path, { prepareHeaders, ...args })
          }
        } finally {
          release()
        }
      }
    }

    return result
  }

const authFetchFn = reAuthFetchFn({
  refreshToken: async (args: FetchArgs) => {
    const result = await baseFetchFn<Session>('/auth/refresh', {
      ...args,
      method: 'POST',
      body: JSON.stringify({ refresh_token: useAuth.getState().session.refresh_token }),
    })

    if (!result.error) {
      useAuth.getState().login(result.data)

      return true
    }

    useAuth.getState().logout()

    return false
  },
})

export const fetchFn = <T = unknown>(
  path: string,
  { prepareHeaders = (x) => Promise.resolve(x), ...args }: FetchArgs = {}
) => {
  const prepare = async (headers: Headers) => {
    const { access_token } = useAuth.getState().session

    if (access_token) {
      headers = new Headers(headers)
      headers.set('Authorization', `Bearer ${access_token}`)
    }

    return (await prepareHeaders(headers)) || headers
  }

  return authFetchFn<T>(path, { prepareHeaders: prepare, ...args }).then((data) => {
    if (!!data.error && (!args.method || args.method === 'GET')) {
      if (!data.meta?.response) {
        throw new Response('', {
          status: 404,
          statusText: 'Not Found',
        })
      }

      throw data.meta.response
    }

    return data
  })
}
