import { ApiFetchArgs, baseFetchFn, fetchFn, Session } from '.'

export type SignInRequest = {
  username: string
  password: string
}

export type TwoFaRequest = {
  code: string
}

export type SseRequest = {
  client_id: string
}

export const signInApi = (request: SignInRequest, args: ApiFetchArgs = {}) =>
  baseFetchFn<Session>('/auth/sign-in', {
    ...args,
    method: 'POST',
    body: JSON.stringify(request),
  })

export const twoFaApi = ({ code }: TwoFaRequest, args: ApiFetchArgs = {}) =>
  fetchFn<Session>('/auth/otp', {
    ...args,
    method: 'POST',
    body: JSON.stringify({ password: code }),
  })

export const sseApi = (request: SseRequest, args: ApiFetchArgs = {}) =>
  fetchFn<Session>('/auth/sse', {
    ...args,
    method: 'POST',
    body: JSON.stringify(request),
  })
