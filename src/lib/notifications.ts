import { showNotification } from '@mantine/notifications'
import { NotificationProps } from '@mantine/notifications/lib/types'

import { FetchError } from '@/api'

export const showError = (
  err: FetchError | string,
  { title = 'Error', autoClose = 10000, color = 'red', ...rest }: Omit<NotificationProps, 'message'> = {}
) => {
  const message =
    typeof err === 'string' ? err : 'error' in err ? err?.error : (err.data as { message: string })?.message ?? ''

  showNotification({ title, message, autoClose, color, ...rest })
}

export const showSuccess = (
  message: string,
  { title = 'Success', autoClose = 3000, color = 'green', ...rest }: Omit<NotificationProps, 'message'> = {}
) => showNotification({ title, message, autoClose, color, ...rest })
