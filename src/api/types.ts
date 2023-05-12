import { JwtPayload } from 'jwt-decode'
import { v4 as uuidv4 } from 'uuid'

export type Page<T = unknown> = {
  data?: T[]
  total: number
  index: number
  size: number
}

export type User = {
  username: string
  email: string
}

export type UserJWT = JwtPayload &
  User & {
    otp: boolean
  }

export type Session = {
  readonly access_token: string
  readonly refresh_token: string
}

export type Site = {
  id: string
  domain: string
  favicon: string
  title: string
  languages: string[]
  enabled: boolean
  created_at: string
  updated_at: string
}

export const JOB_OPTIONS = [
  'task-id',
  'unique',
  'max-retry',
  'queue',
  'timeout',
  'deadline',
  'process-at',
  'process-in',
  'retention',
  'group',
] as const

export const QUEUES = ['jobfeed', 'jobsitemap'] as const

export type Queue = (typeof QUEUES)[number]

export type JobOptionType = (typeof JOB_OPTIONS)[number]

export type JobOption = {
  type: JobOptionType
  value: string
}

export const JOB_NAMES = ['job:feed', 'job:sitemap'] as const

export type JobName = (typeof JOB_NAMES)[number]

export type FeedPayload = {
  site_id: string
  link: string
}

export type SitemapPayload = {
  site_id: string
  link: string
  lang: string
  match_loc: string
  search_loc: string
  search_link: string
  index: boolean
  stop_on_dup: boolean
}

export type Job = {
  id: string
  cron_expr: string
  name: JobName
  payload?: FeedPayload | SitemapPayload
  options?: JobOption[]
  enabled: boolean
  created_at: string
  updated_at: string
}

export const CHAT_TYPES = ['private', 'group', 'supergroup', 'channel'] as const

export type ChatType = (typeof CHAT_TYPES)[number]

export type ChatRights = {
  status: string
  is_anonymous: boolean
  until_date: number
  can_be_edited: boolean
  can_manage_chat: boolean
  can_post_messages: boolean
  can_edit_messages: boolean
  can_delete_messages: boolean
  can_restrict_members: boolean
  can_promote_members: boolean
  can_change_info: boolean
  can_invite_users: boolean
  can_pin_messages: boolean
  is_member: boolean
  can_send_messages: boolean
  can_send_media_messages: boolean
  can_send_polls: boolean
  can_send_other_messages: boolean
  can_add_web_page_previews: boolean
}

export type Chat = {
  id: string
  telegram_id: number
  type: ChatType
  title?: string
  username?: string
  first_name?: string
  last_name?: string
  broadcast?: string[]
  rights?: ChatRights
  blocked: boolean
  deleted: boolean
  created_at: string
  updated_at: string
}

export const ARTICLE_SOURCES = ['feed', 'sitemap'] as const

export const MEDIA_TYPES = ['image', 'video', 'audio'] as const

export type ArticleSource = (typeof ARTICLE_SOURCES)[number]

export type MediaType = (typeof MEDIA_TYPES)[number]

export type ArticleMedia = {
  url: string
  type: MediaType
}

export type Article = {
  id: string
  link: string
  site_id: string
  source: ArticleSource
  lang: string
  title: string
  short_desc?: string
  long_desc?: string
  media?: ArticleMedia[]
  pub_date: string
  created_at: string
  updated_at: string
  categories?: string[]
}

export const defaultJobOptions = (name?: JobName): JobOption[] =>
  JOB_OPTIONS.map((o) => ({
    type: o,
    value:
      o === 'task-id'
        ? uuidv4()
        : o === 'queue' && name !== undefined
        ? name === JOB_NAMES[0]
          ? QUEUES[0]
          : QUEUES[1]
        : '',
  }))

export type QueueInfo = {
  queue: string
  paused: boolean
  size: number
  groups: number
  latency_msec: number
  display_latency: string
  memory_usage_bytes: number
  active: number
  pending: number
  aggregating: number
  scheduled: number
  retry: number
  archived: number
  completed: number
  processed: number
  failed: number
  timestamp: string
}

export type DailyQueueStat = {
  queue: string
  date: string
  processed: number
  failed: number
}

export type DailyQueueStats = {
  [qname: string]: DailyQueueStat[]
}

export type SchedulerEntry = {
  id: string
  spec: string
  job_name: JobName
  job_payload: (FeedPayload | SitemapPayload) & { job_id: string }
  options: string[]
  next_enqueue_at: string
  prev_enqueue_at?: string
}

export type SchedulerEntries = {
  [job_id: string]: SchedulerEntry
}
