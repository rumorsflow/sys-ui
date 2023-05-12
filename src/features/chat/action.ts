import { redirect } from 'react-router-dom'
import { ActionFunction, ActionFunctionArgs } from '@remix-run/router/utils'

import { createChatApi, CreateChatRequest, updateChatApi } from '@/api'
import { fromForm, showSuccess, toError } from '@/lib'

const formData = async (request: Request): Promise<CreateChatRequest> => {
  const { telegram_id, ...rest } = await fromForm<Omit<CreateChatRequest, 'telegram_id'> & { telegram_id: string }>(
    request
  )

  return {
    telegram_id: +telegram_id,
    ...rest,
  }
}

export const createChatAction: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const data = await formData(request)

  const result = await createChatApi(data, request.signal)

  if (result.error) {
    return toError(result.error, `Chat ${data.telegram_id} already exists.`, 'telegram_id')
  }

  showSuccess(`New chat has been added successfully.`)

  return redirect(`/chats/${result.meta?.id}`)
}

export const updateChatAction: ActionFunction = async ({ request, params }: ActionFunctionArgs) => {
  const data = await formData(request)

  const result = await updateChatApi(
    {
      id: params.id as string,
      broadcast: data.broadcast,
      blocked: data.blocked,
    },
    request.signal
  )

  if (result.error) {
    return toError(result.error)
  }

  showSuccess(`Chat has been updated successfully.`)

  return redirect(`/chats/${params.id}`)
}
