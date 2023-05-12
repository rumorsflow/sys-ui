import {
  createApi,
  getApi,
  Page,
  Job,
  updateApi,
  deleteApi,
  JobOption,
  FetchResponse,
  Site,
  FeedPayload,
  SitemapPayload,
  getSelectSiteListApi,
} from '.'

export type CreateJobRequest = {
  cron_expr: string
  name: string
  payload: FeedPayload | SitemapPayload
  options: JobOption[]
  enabled: boolean
}

export type UpdateJobRequest = Partial<CreateJobRequest> & {
  id: string
}

export const getJobListApi = (params: URLSearchParams, signal?: AbortSignal) =>
  getApi<Page<Job>>('/jobs', { params, signal })

export const getJobApi = (id: string, signal?: AbortSignal) =>
  Promise.all([getApi<Job>(`/jobs/${id}`, { signal }), getSelectSiteListApi(signal)]).then(
    (data: [FetchResponse<Job>, FetchResponse<Page<Site>>]) => {
      if (data[0].error !== undefined) {
        return data[0]
      }

      if (data[1].error !== undefined) {
        return data[1]
      }

      return {
        error: undefined,
        meta: data[0].meta,
        data: [data[0].data, data[1].data],
      }
    }
  )

export const createJobApi = (request: CreateJobRequest, signal?: AbortSignal) => createApi('/jobs', request, { signal })

export const updateJobApi = ({ id, ...request }: UpdateJobRequest, signal?: AbortSignal) =>
  updateApi(`/jobs/${id}`, request, { signal })

export const deleteJobApi = (id: string, signal?: AbortSignal) => deleteApi(`/jobs/${id}`, { signal })
