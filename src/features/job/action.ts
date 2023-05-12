import { redirect } from 'react-router-dom'
import { ActionFunction, ActionFunctionArgs } from '@remix-run/router/utils'

import { createJobApi, CreateJobRequest, updateJobApi } from '@/api'
import { fromForm, showSuccess, toError } from '@/lib'

const formData = async (request: Request): Promise<CreateJobRequest> => {
  const data = await fromForm<CreateJobRequest>(request)

  return { ...data, options: data.options.filter((o) => o.value.trim() !== '') }
}

export const createJobAction: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const result = await createJobApi(await formData(request), request.signal)

  if (result.error) {
    return toError(result.error)
  }

  showSuccess(`New job has been added successfully.`)

  return redirect(`/jobs/${result.meta?.id}`)
}

export const updateJobAction: ActionFunction = async ({ request, params }: ActionFunctionArgs) => {
  const result = await updateJobApi({ id: params.id as string, ...(await formData(request)) }, request.signal)

  if (result.error) {
    return toError(result.error)
  }

  showSuccess(`Job has been updated successfully.`)

  return redirect(`/jobs/${params.id}`)
}
