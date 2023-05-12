import { createApi, deleteApi, getApi, Page, Site, updateApi } from '.'

export type CreateSiteRequest = {
  domain: string
  favicon: string
  title: string
  languages: string[]
  enabled: boolean
}

export type UpdateSiteRequest = Partial<CreateSiteRequest> & {
  id: string
}

export const getSiteListApi = (params: URLSearchParams, signal?: AbortSignal) =>
  getApi<Page<Site>>('/sites', { params, signal })

export const getSelectSiteListApi = (signal?: AbortSignal) =>
  getSiteListApi(new URLSearchParams('index=0&size=100&sort=domain'), signal)

export const getSiteApi = (id: string, signal?: AbortSignal) => getApi<Site>(`/sites/${id}`, { signal })

export const createSiteApi = (request: CreateSiteRequest, signal?: AbortSignal) =>
  createApi('/sites', request, { signal })

export const updateSiteApi = ({ id, ...request }: UpdateSiteRequest, signal?: AbortSignal) =>
  updateApi(`/sites/${id}`, request, { signal })

export const deleteSiteApi = (id: string, signal?: AbortSignal) => deleteApi(`/sites/${id}`, { signal })
