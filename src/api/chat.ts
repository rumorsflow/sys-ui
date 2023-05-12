import {
  createApi,
  getApi,
  Page,
  Chat,
  updateApi,
  deleteApi,
  ChatType,
  FetchResponse,
  Site,
  getSelectSiteListApi,
} from '.'

export type CreateChatRequest = {
  telegram_id: number
  type: ChatType
  title: string
  username: string
  first_name: string
  last_name: string
  broadcast: string[]
  blocked: boolean
  deleted: boolean
}

export type UpdateChatRequest = {
  id: string
  broadcast?: string[]
  blocked?: boolean
}

export const getChatListApi = (params: URLSearchParams, signal?: AbortSignal) =>
  getApi<Page<Chat>>('/chats', { params, signal })

export const getChatApi = (id: string, signal?: AbortSignal) =>
  Promise.all([getApi<Chat>(`/chats/${id}`, { signal }), getSelectSiteListApi(signal)]).then(
    (data: [FetchResponse<Chat>, FetchResponse<Page<Site>>]) => {
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

export const createChatApi = (request: CreateChatRequest, signal?: AbortSignal) =>
  createApi('/chats', request, { signal })

export const updateChatApi = ({ id, ...request }: UpdateChatRequest, signal?: AbortSignal) =>
  updateApi(`/chats/${id}`, request, { signal })

export const deleteChatApi = (id: string, signal?: AbortSignal) => deleteApi(`/chats/${id}`, { signal })
