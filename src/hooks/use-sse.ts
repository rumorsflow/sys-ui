import { useCallback, useEffect, useRef, useState } from 'react'

import { sseApi } from '@/api'

export type EventSourceStatus = 'init' | 'open' | 'authorized' | 'closed' | 'error'

export type EventSourceEvent = Event & { data: string }

class ES extends EventSource {
  private readonly controller: AbortController
  private readonly timeout: ReturnType<typeof setTimeout>

  constructor(url: string, eventSourceInitDict?: EventSourceInit) {
    super(url, eventSourceInitDict)

    this.controller = new AbortController()
    this.timeout = setTimeout(this.close.bind(this), 5000)

    this.addEventListener('connected', this.connected.bind(this))
    this.addEventListener('closing', this.closing.bind(this))
  }

  abort(): void {
    this.controller.abort()
  }

  closing(): void {
    this.abort()
    this.close()
    this.dispatchEvent(new Event('closed'))
  }

  private async connected(evt: EventSourceEvent): Promise<void> {
    try {
      await sseApi({ client_id: evt.data }, { signal: this.controller.signal })
      clearTimeout(this.timeout)
      this.dispatchEvent(new Event('authorized'))
    } catch (error) {
      this.dispatchEvent(new Event('error', { error, message: 'Unauthorized' } as ErrorEventInit))
      this.close()
    }
  }
}

export const useSse = (url: string, withCredentials?: boolean) => {
  const [status, setStatus] = useState<EventSourceStatus>('init')
  const source = useRef<ES | null>(null)
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const frequency = useRef<number>(1)

  const onTimeout = useCallback((fn: () => void) => {
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => {
      fn()
      frequency.current *= 2
      if (frequency.current > 60) {
        frequency.current = 60
      }
    }, frequency.current * 1000)
  }, [])

  const connect = useCallback(() => {
    const es = new ES(url, { withCredentials })
    source.current = es

    es.addEventListener('open', () => {
      setStatus('open')
      clearTimeout(timeout.current)
    })
    es.addEventListener('authorized', () => setStatus('authorized'))
    es.addEventListener('error', () => {
      setStatus('error')
      onTimeout(connect)
    })
    es.addEventListener('closed', () => {
      setStatus('closed')
      onTimeout(connect)
    })
  }, [url, withCredentials, onTimeout])

  useEffect(() => {
    if (url) {
      connect()

      return () => {
        clearTimeout(timeout.current)
        source.current?.abort()
        source.current?.close()
        source.current = null
      }
    }

    setStatus('closed')

    return undefined
  }, [url, connect])

  return [source.current, status] as const
}

export function useSseListener(
  source: EventSource | null,
  types: string[],
  listener: (e: EventSourceEvent) => void,
  dependencies: any[] = [] // eslint-disable-line
) {
  useEffect(() => {
    if (source) {
      types.forEach((type) => source.addEventListener(type, listener as any)) // eslint-disable-line

      return () => types.forEach((type) => source.removeEventListener(type, listener as any)) // eslint-disable-line
    }

    return undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, ...dependencies])
}
