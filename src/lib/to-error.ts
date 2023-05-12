import { FetchError } from '@/api'

import { showError } from '.'

const CONFLICT_MESSAGE = 'The request could not be completed due to a conflict with the current state of the resource'

export type ErrorMessage = {
  type: 'custom'
  message: string
}

export const serverErrors = (err: FetchError) =>
  err.status === 422
    ? (err.data as { data: { field: string; message: string }[] }).data.reduce(
        (acc, cur) => ({
          ...acc,
          [cur.field.replace(/\[\d]$/, '')]: {
            type: 'custom',
            message: cur.message.split('Error:')[1],
          } as ErrorMessage,
        }),
        {} as Record<string, ErrorMessage>
      )
    : {}

export const toError = (err: FetchError, conflict = CONFLICT_MESSAGE, field?: string) => {
  if (err.status === 409) {
    showError({ status: 'CUSTOM_ERROR', error: conflict })

    if (field) {
      return { ok: false, errors: { [field]: { type: 'custom', message: conflict } as ErrorMessage } }
    }
  } else {
    showError(err)
  }

  return { ok: false, errors: serverErrors(err) }
}
