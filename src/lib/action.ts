import { redirect } from 'react-router-dom'
import { ActionFunction, ActionFunctionArgs } from '@remix-run/router/utils'

import { FetchResponse } from '@/api'

import { showError, showSuccess } from './notifications'

type ApiFn = (id: string, signal?: AbortSignal) => Promise<FetchResponse>

export const deleteAction =
  (fn: ApiFn, to: string, message: string, status = 301): ActionFunction =>
  async ({ request, params }: ActionFunctionArgs) => {
    const result = await fn(params.id as string, request.signal)

    if (result.error) {
      showError(result.error)
    } else {
      showSuccess(message)
    }

    return redirect(to, status)
  }
