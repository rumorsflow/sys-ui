import React, { lazy } from 'react'
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom'
import { IconPlus } from '@tabler/icons-react'

import { APP_BASE_URL, TO_ARTICLES, TO_CHATS, TO_JOBS, TO_SITES } from '@/config'
import { deleteAction, listLoader, loader, oneLoader } from '@/lib'
import {
  Chat,
  deleteArticleApi,
  deleteChatApi,
  deleteJobApi,
  deleteQueueApi,
  deleteSiteApi,
  getArticleApi,
  getArticleListApi,
  getChatApi,
  getChatListApi,
  getJobApi,
  getJobListApi,
  getSelectSiteListApi,
  getSiteApi,
  getSiteListApi,
  Page,
  Site,
} from '@/api'
import { DotsLoader, HelmetTitle, MainLayout, Protected, Public, RouteErrorPage, RouteOutlet } from '@/ui'
import { signInAction, twoFaAction } from '@/features/auth/action'
import { createSiteAction, updateSiteAction } from '@/features/site'
import { updateArticleAction } from '@/features/article'
import { createChatAction, updateChatAction } from '@/features/chat'
import { createJobAction, updateJobAction } from '@/features/job'
import { controlQueueAction } from '@/features/queue'

const SignInPage = lazy(() => import('../../features/auth/sign-in'))
const TwoFaPage = lazy(() => import('../../features/auth/2fa'))
const DashboardPage = lazy(() => import('../../features/dashboard'))
const SiteListPage = lazy(() => import('../../features/site/list'))
const NewSitePage = lazy(() => import('../../features/site/new'))
const EditSitePage = lazy(() => import('../../features/site/edit'))
const ArticleListPage = lazy(() => import('../../features/article/list'))
const EditArticlePage = lazy(() => import('../../features/article/edit'))
const ChatListPage = lazy(() => import('../../features/chat/list'))
const NewChatPage = lazy(() => import('../../features/chat/new'))
const EditChatPage = lazy(() => import('../../features/chat/edit'))
const JobListPage = lazy(() => import('../../features/job/list'))
const NewJobPage = lazy(() => import('../../features/job/new'))
const EditJobPage = lazy(() => import('../../features/job/edit'))

const sites: RouteObject[] = [
  {
    path: '/sites',
    element: <SiteListPage />,
    loader: listLoader(getSiteListApi, '/sites/'),
    handle: { title: 'Sites', links: [{ to: '/sites/new', label: 'New site', icon: IconPlus }] },
    children: [
      {
        path: 'new',
        element: <NewSitePage />,
        action: createSiteAction,
        handle: { title: 'New site' },
      },
      {
        path: ':id',
        element: <EditSitePage />,
        loader: oneLoader(getSiteApi),
        action: updateSiteAction,
        handle: { title: (data: Site) => `Edit ${data?.domain ?? 'site'}` },
      },
    ],
  },
  { path: 'sites/:id/delete', action: deleteAction(deleteSiteApi, TO_SITES, 'Site has been deleted successfully.') },
]

const articles: RouteObject[] = [
  {
    path: '/articles',
    element: <ArticleListPage />,
    loader: listLoader(getArticleListApi, '/articles/'),
    handle: { title: 'Articles' },
    children: [
      {
        path: ':id',
        element: <EditArticlePage />,
        loader: oneLoader(getArticleApi),
        action: updateArticleAction,
        handle: { title: 'Edit article' },
      },
    ],
  },
  {
    path: 'articles/:id/delete',
    action: deleteAction(deleteArticleApi, TO_ARTICLES, 'Article has been deleted successfully.'),
  },
]

const chats: RouteObject[] = [
  {
    path: '/chats',
    element: <ChatListPage />,
    loader: listLoader(getChatListApi, '/chats/'),
    handle: { title: 'Chats', links: [{ to: '/chats/new', label: 'New chat', icon: IconPlus }] },
    children: [
      {
        path: 'new',
        element: <NewChatPage />,
        loader: loader(getSelectSiteListApi),
        action: createChatAction,
        handle: { title: 'New chat' },
      },
      {
        path: ':id',
        element: <EditChatPage />,
        loader: oneLoader(getChatApi),
        action: updateChatAction,
        handle: { title: (data: [Chat, Page<Site>]) => `Edit ${data[0]?.title ?? data[0]?.username ?? 'chat'}` },
      },
    ],
  },
  { path: 'chats/:id/delete', action: deleteAction(deleteChatApi, TO_CHATS, 'Chat has been deleted successfully.') },
]

const jobs: RouteObject[] = [
  {
    path: '/jobs',
    element: <JobListPage />,
    loader: listLoader(getJobListApi, '/jobs/'),
    handle: { title: 'Jobs', links: [{ to: '/jobs/new', label: 'New job', icon: IconPlus }] },
    children: [
      {
        path: 'new',
        element: <NewJobPage />,
        loader: loader(getSelectSiteListApi),
        action: createJobAction,
        handle: { title: 'New job' },
      },
      {
        path: ':id',
        element: <EditJobPage />,
        loader: oneLoader(getJobApi),
        action: updateJobAction,
        handle: { title: 'Edit job' },
      },
    ],
  },
  { path: 'jobs/:id/delete', action: deleteAction(deleteJobApi, TO_JOBS, 'Job has been deleted successfully.') },
]

const queues: RouteObject[] = [
  { path: 'queues/:id/control', action: controlQueueAction },
  { path: 'queues/:id/delete', action: deleteAction(deleteQueueApi, '/', 'Queue has been deleted successfully.') },
]

const router = createBrowserRouter(
  [
    {
      element: (
        <>
          <HelmetTitle />
          <RouteOutlet h="100vh" />
        </>
      ),
      errorElement: <RouteErrorPage />,
      children: [
        {
          element: <MainLayout />,
          children: [
            {
              path: '/',
              element: <RouteOutlet h="100vh" />,
              errorElement: <RouteErrorPage />,
              children: [
                { index: true, element: <DashboardPage />, handle: { title: 'Dashboard' } },
                ...sites,
                ...articles,
                ...chats,
                ...jobs,
                ...queues,
              ],
            },
          ],
        },
        {
          element: <Public />,
          children: [{ path: '/sign-in', element: <SignInPage />, action: signInAction, handle: { title: 'Sign in' } }],
        },
        {
          element: <Protected />,
          children: [
            { path: '/sign-in/2fa', element: <TwoFaPage />, action: twoFaAction, handle: { title: 'Sign in' } },
          ],
        },
      ],
    },
  ],
  { basename: APP_BASE_URL }
)

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose())
}

export const withRouter = (component: () => React.ReactNode) => () =>
  (
    <>
      <RouterProvider router={router} fallbackElement={<DotsLoader h="100vh" />} />
      {component()}
    </>
  )
