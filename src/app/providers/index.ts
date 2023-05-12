import { compose } from '@/lib'

import { withHelmet } from './with-helmet'
import { withMantine } from './with-mantine'
import { withNotifications } from './with-notifications'
import { withRouter } from './with-router'

export const withProviders = compose(withHelmet, withMantine, withNotifications, withRouter)
