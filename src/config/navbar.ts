import { IconBrandWechat, IconDashboard, IconNews, IconWorld, IconWreckingBall, Icon } from '@tabler/icons-react'

export const TO_SITES = '/sites?sort=domain'
export const TO_ARTICLES = '/articles?sort=-updated_at'
export const TO_CHATS = '/chats?sort=-updated_at'
export const TO_JOBS = '/jobs?sort=-updated_at'

export type IconLinkProps = {
  to: string
  label: string
  icon: Icon
}

export const navbarLinks: IconLinkProps[] = [
  { to: '/', label: 'Dashboard', icon: IconDashboard },
  { to: TO_SITES, label: 'Sites', icon: IconWorld },
  { to: TO_ARTICLES, label: 'Articles', icon: IconNews },
  { to: TO_CHATS, label: 'Chats', icon: IconBrandWechat },
  { to: TO_JOBS, label: 'Jobs', icon: IconWreckingBall },
]
