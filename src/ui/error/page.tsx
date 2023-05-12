import React from 'react'
import { Helmet } from 'react-helmet-async'

import { Wrapper } from './wrapper'

type PageProps = {
  status: number
}

export const Page: React.FC<PageProps> = ({ status = 999 }) => {
  let title = 'Oups, sometinh went wrong.'
  let message: string | undefined

  switch (status) {
    case 404:
      title = 'You have found a secret place.'
      message =
        'Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has been moved to another URL.'
      break
    case 403:
      title = 'Access Forbidden'
      message = "You don't have permission to access this page."
      break
    case 422:
      title = 'Unprocessable Entity'
  }

  return (
    <>
      <Helmet title={title} />
      <Wrapper status={status} title={title} message={message} />
    </>
  )
}
