import { ComponentType } from 'react'

export const toDefault = <T extends ComponentType<any>>( // eslint-disable-line
  promise: Promise<{ [key: string]: T }>,
  key: string
): Promise<{ default: T }> => promise.then((value) => Promise.resolve({ default: value[key] }))
