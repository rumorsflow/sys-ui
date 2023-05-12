import { deleteApi, getApi, Page, Article, updateApi, ArticleMedia } from '.'

export type UpdateArticleRequest = {
  id: string
  lang?: string
  title?: string
  short_desc?: string
  long_desc?: string
  media?: ArticleMedia
  categories?: string[]
}

export const getArticleListApi = (params: URLSearchParams, signal?: AbortSignal) =>
  getApi<Page<Article>>('/articles', { params, signal })

export const getArticleApi = (id: string, signal?: AbortSignal) => getApi<Article>(`/articles/${id}`, { signal })

export const updateArticleApi = ({ id, ...request }: UpdateArticleRequest, signal?: AbortSignal) =>
  updateApi(`/articles/${id}`, request, { signal })

export const deleteArticleApi = (id: string, signal?: AbortSignal) => deleteApi(`/articles/${id}`, { signal })
