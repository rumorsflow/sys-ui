import { deleteApi, fetchFn } from '.'

export type ControlQueue = 'pause' | 'resume'

export const deleteQueueApi = (qname: string, signal?: AbortSignal) => deleteApi(`/queues/${qname}`, { signal })

export const controlQueueApi = (qname: string, control: ControlQueue, signal?: AbortSignal) =>
  fetchFn(`/queues/${qname}/${control}`, { signal, method: 'POST' })
