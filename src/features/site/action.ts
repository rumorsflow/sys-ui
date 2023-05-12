import { redirect } from 'react-router-dom'
import { ActionFunction, ActionFunctionArgs } from '@remix-run/router/utils'

import { createSiteApi, CreateSiteRequest, updateSiteApi } from '@/api'
import { fromForm, showSuccess, toError } from '@/lib'

export const createSiteAction: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const data = await fromForm<CreateSiteRequest>(request)

  const result = await createSiteApi(data, request.signal)

  if (result.error) {
    return toError(result.error, `Site ${data.domain} already exists.`, 'domain')
  }

  showSuccess(`New site ${data.domain} has been added successfully.`)

  return redirect(`/sites/${result.meta?.id}`)
}

export const updateSiteAction: ActionFunction = async ({ request, params }: ActionFunctionArgs) => {
  const data = await fromForm<CreateSiteRequest>(request)

  const result = await updateSiteApi({ id: params.id as string, ...data }, request.signal)

  if (result.error) {
    return toError(result.error, `Site ${data.domain} already exists.`, 'domain')
  }

  showSuccess(`Site ${data.domain} has been updated successfully.`)

  return redirect(`/sites/${params.id}`)
}
