import { useLoaderData as useBaseLoaderData } from 'react-router-dom'

export const useLoaderData = <T = unknown>() => {
  const data = useBaseLoaderData()

  return (data as { data: T }).data
}
