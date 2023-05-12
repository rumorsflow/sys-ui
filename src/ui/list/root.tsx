import React from 'react'
import { createStyles, ScrollArea, Table } from '@mantine/core'

type RootProps = {
  verticalAlign?: 'top'
  children: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  scrollRef?: React.ForwardedRef<HTMLDivElement>
}

const useStyles = createStyles(() => ({
  table: {
    '& td': {
      verticalAlign: 'top',
    },
  },
}))

export const Root: React.FC<RootProps> = ({ verticalAlign, children, header, footer, scrollRef }) => {
  const { classes } = useStyles()

  return (
    <ScrollArea viewportRef={scrollRef} sx={{ flexGrow: 1 }} scrollbarSize={3} mr="-sm" mb="-sm" pr="sm" pb="sm">
      <Table
        className={verticalAlign ? classes.table : ''}
        captionSide="bottom"
        horizontalSpacing="xs"
        verticalSpacing="xs"
        fontSize="sm"
        withBorder
        striped
        highlightOnHover
      >
        {header && <thead>{header}</thead>}
        <tbody>{children}</tbody>
        {footer && <caption>{footer}</caption>}
      </Table>
    </ScrollArea>
  )
}
