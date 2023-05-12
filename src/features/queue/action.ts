import { redirect } from 'react-router-dom'
import { ActionFunction, ActionFunctionArgs } from '@remix-run/router/utils'

import { fromForm, showSuccess, toError } from '@/lib'
import { ControlQueue, controlQueueApi } from '@/api'

export const controlQueueAction: ActionFunction = async ({ request, params }: ActionFunctionArgs) => {
  const qname = params.id as string
  const data = await fromForm<{ control: ControlQueue }>(request)

  const result = await controlQueueApi(qname, data.control, request.signal)

  if (result.error) {
    return toError(result.error)
  }

  showSuccess(`Queue has been ${data.control}d.`)

  return redirect('/')
}
