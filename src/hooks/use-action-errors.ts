import React, { useEffect, useState } from 'react'
import { UNSAFE_DataRouterStateContext as DataRouterStateContext } from 'react-router'

import { ErrorMessage } from '@/lib'

type Result =
  | {
      ok: false
      errors: Record<string, ErrorMessage>
    }
  | {
      ok: true
      errors: undefined
    }

const ok: Result = { ok: true, errors: undefined }
const empty = { ok }

export const useActionErrors = () => {
  const state = React.useContext(DataRouterStateContext)
  const [result, setResult] = useState<Result>(ok)

  useEffect(() => {
    setResult(Object.values(state?.actionData || empty)[0] as Result)
  }, [state?.actionData])

  return result
}
