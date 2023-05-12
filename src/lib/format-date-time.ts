export type FormatDateTimeConfig = {
  dateStyle?: 'full' | 'long' | 'medium' | 'short' | undefined
  timeStyle?: 'full' | 'long' | 'medium' | 'short' | undefined
}

export type Duration = {
  hour: number
  minute: number
  second: number
  totalSeconds: number
}

const defaultConfig: FormatDateTimeConfig = {
  dateStyle: 'medium',
  timeStyle: 'short',
}

const parseDateTime = (str: string): Date => new Date(Date.parse(str))

export const formatDateTime = (date: string | Date, { dateStyle, timeStyle }: FormatDateTimeConfig = defaultConfig) => {
  if (typeof date === 'string') {
    date = parseDateTime(date)
  }

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const locale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language

  return date.toLocaleString(locale, { timeZone, dateStyle: dateStyle ?? 'medium', timeStyle: timeStyle ?? 'short' })
}

export const durationFromSeconds = (totalSeconds: number): Duration => {
  const hour = Math.floor(totalSeconds / 3600)
  const minute = Math.floor((totalSeconds - 3600 * hour) / 60)
  const second = totalSeconds - 3600 * hour - 60 * minute

  return { hour, minute, second, totalSeconds }
}

export const durationBetween = (start: number, end: number): Duration => {
  const durationInMillisec = start - end
  const totalSeconds = Math.floor(durationInMillisec / 1000)

  return durationFromSeconds(totalSeconds)
}

export const stringifyDuration = (d: Duration): string => {
  if (d.hour > 24) {
    const n = Math.floor(d.hour / 24)

    return n + (n === 1 ? ' day' : ' days')
  }

  return (d.hour !== 0 ? `${d.hour}h` : '') + (d.minute !== 0 ? `${d.minute}m` : '') + `${d.second}s`
}

export const durationBefore = (timestamp: string): string => {
  try {
    const duration = durationBetween(Date.parse(timestamp), Date.now())
    if (duration.totalSeconds < 1) {
      return 'now'
    }

    return 'in ' + stringifyDuration(duration)
  } catch {
    return '-'
  }
}

export const timeAgoUnix = (unixtime: number): string => {
  if (unixtime === 0) {
    return ''
  }
  const duration = durationBetween(Date.now(), unixtime * 1000)

  return stringifyDuration(duration) + ' ago'
}

const zeroTimestamp = '0001-01-01T00:00:00Z'

export const timeAgo = (timestamp: string): string => {
  if (timestamp === zeroTimestamp) {
    return '-'
  }
  try {
    return timeAgoUnix(Date.parse(timestamp) / 1000)
  } catch (error) {
    console.error('Could not parse timestamp: ', timestamp, error) // eslint-disable-line

    return '-'
  }
}
