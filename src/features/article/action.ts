import { redirect } from 'react-router-dom'
import { ActionFunction, ActionFunctionArgs } from '@remix-run/router/utils'

import { updateArticleApi, UpdateArticleRequest } from '@/api'
import { fromForm, showSuccess, toError } from '@/lib'

export const updateArticleAction: ActionFunction = async ({ request, params }: ActionFunctionArgs) => {
  const data = await fromForm<Omit<UpdateArticleRequest, 'id'>>(request)

  const result = await updateArticleApi({ id: params.id as string, ...data }, request.signal)

  if (result.error) {
    return toError(result.error)
  }

  showSuccess(`Article ${data.title} has been updated successfully.`)

  return redirect(`/articles/${params.id}`)
}
