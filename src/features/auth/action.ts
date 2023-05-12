import { ActionFunction, ActionFunctionArgs } from '@remix-run/router/utils'

import { signInApi, SignInRequest, twoFaApi } from '@/api'
import { fromForm, showError } from '@/lib'
import { useAuth } from '@/store'

export const signInAction: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const data = await fromForm<SignInRequest>(request)

  const result = await signInApi(data, { signal: request.signal })

  if (result.error) {
    showError(result.error)
  } else {
    useAuth.getState().login(result.data)
  }

  return { ok: !result.error }
}

export const twoFaAction: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()

  const result = await twoFaApi(
    {
      code: formData.get('code') as string,
    },
    { signal: request.signal }
  )

  if (result.error) {
    showError(result.error)
  } else {
    useAuth.getState().login(result.data)
  }

  return { ok: !result.error }
}
