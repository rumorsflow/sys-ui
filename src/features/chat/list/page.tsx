import React from 'react'

import { TO_CHATS } from '@/config'
import { AwaiterPage } from '@/ui'

import { ChatList } from '../ui/list'

export const ChatListPage: React.FC = () => (
  <AwaiterPage path={TO_CHATS}>
    <ChatList />
  </AwaiterPage>
)
