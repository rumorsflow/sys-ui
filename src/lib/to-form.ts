export const toForm = <T extends { [key: string]: any }>(data: T): FormData => { // eslint-disable-line
  const formData = new FormData()
  formData.set('data', JSON.stringify(data))

  return formData
}

export const fromForm = async <T extends { [key: string]: any }>(request: Request): Promise<T> => { // eslint-disable-line
  const fd = await request.formData()

  return JSON.parse(fd.get('data') as string) as T
}
