import { env } from './meta'

export const APP_BASE_URL = env.BASE_URL
export const API_URL = env.VITE_APP_API_URL
export const APP_PER_PAGE = parseInt(env.VITE_APP_PER_PAGE ?? '50', 10)

export const APP_NAME_SHORT = env.VITE_APP_NAME_SHORT ?? 'RF'
export const APP_NAME_LONG = env.VITE_APP_NAME_LONG ?? 'Rumors Flow'
export const APP_NAME_TEMPLATE = `%s | ${APP_NAME_LONG}`
