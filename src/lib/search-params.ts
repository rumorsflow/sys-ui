import { APP_PER_PAGE } from '@/config'

export const searchParams = (url: string, defaultSort?: string): URLSearchParams => {
  const [, query] = url.split('?', 2)
  const params = new URLSearchParams(query)

  if (defaultSort && !params.has('sort')) {
    params.set('sort', defaultSort)
  }

  let size = +(params.get('size') ?? '0')
  if (size <= 0) {
    size = APP_PER_PAGE
  }
  params.set('size', `${size}`)

  let page = +(params.get('page') ?? '1')
  if (page < 1) {
    page = 1
  }
  const index = (page - 1) * size
  params.set('index', `${index}`)
  params.delete('page')

  return params
}
