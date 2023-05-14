import { useEffect, useMemo } from 'react'
import { useNavigation } from 'react-router-dom'
import {
  useForm as useBaseForm,
  FieldPath,
  FieldValues,
  DefaultValues,
  UseFormReturn as UseBaseFormReturn,
} from 'react-hook-form'
import { ObjectSchema } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { useActionErrors } from './use-action-errors'

type UseFormReturn<TFieldValues extends FieldValues = FieldValues, TContext = any> = UseBaseFormReturn< // eslint-disable-line
  TFieldValues,
  TContext
> & {
  disabled: boolean
  isLoading: boolean
}

export const useForm = <TFieldValues extends FieldValues = FieldValues, TContext = any>( // eslint-disable-line
  schema: ObjectSchema<TFieldValues>,
  defaultValues?: DefaultValues<TFieldValues>,
  values?: TFieldValues
): UseFormReturn<TFieldValues, TContext> => {
  const { state, formAction } = useNavigation()
  const isLoading = useMemo(() => state !== 'idle' && formAction !== undefined, [state, formAction])
  const data = useActionErrors()

  const { reset, setError, formState, ...rest } = useBaseForm<TFieldValues, TContext>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema as ObjectSchema<any>), // eslint-disable-line
    defaultValues,
    values,
  })

  useEffect(() => {
    if (data.ok) {
      reset(defaultValues)
    } else {
      for (const [field, error] of Object.entries(data.errors ?? {})) {
        setError(field as FieldPath<TFieldValues>, error)
      }
    }
  }, [data, reset, defaultValues, setError])

  return {
    ...rest,
    reset,
    setError,
    formState,
    disabled: useMemo(
      () => isLoading || !(formState.isDirty || Object.keys(formState.dirtyFields).length > 0) || !formState.isValid,
      [isLoading, formState.isDirty, formState.dirtyFields, formState.isValid]
    ),
    isLoading,
  }
}
