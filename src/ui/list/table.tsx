import React, { useMemo } from 'react'
import { Pagination } from '@mantine/core'
import { Sx } from '@mantine/styles/lib/theme/types/DefaultProps'

import { Page } from '@/api'
import { usePagination, useSortTable } from '@/hooks'

import { Root } from './root'
import { Th } from './th'
import { Actions } from './actions'

type Item = {
  id: string
}

export type Col<T extends Item> = {
  label: string
  sort?: keyof T
  className?: string
  sx?: Sx | (Sx | undefined)[]
}

type TableProps<T extends Item> = {
  verticalAlign?: 'top'
  cols?: Col<T>[]
  page: Page<T>
  row: (item: T, index: number, pageIndex: number) => React.ReactNode
}

export function Table<T extends Item>({ verticalAlign, page, row, cols }: TableProps<T>) {
  const { total, page: value, onChange, viewportRef } = usePagination(page.total)
  const { setSorting, reverseSortDirection, sortBy } = useSortTable<T>()

  const header = useMemo(
    () =>
      cols ? (
        <tr>
          {cols.map(({ label, sort, className, sx }) => (
            <React.Fragment key={label}>
              {sort ? (
                <Th
                  className={className}
                  sx={sx}
                  reversed={reverseSortDirection}
                  sorted={sortBy === sort}
                  onSort={() => setSorting(sort)}
                >
                  {label}
                </Th>
              ) : (
                <Th className={className} sx={sx}>
                  {label}
                </Th>
              )}
            </React.Fragment>
          ))}
        </tr>
      ) : undefined,
    [cols, reverseSortDirection, setSorting, sortBy]
  )

  const footer = useMemo(
    () =>
      total > 1 ? (
        <Pagination
          size="md"
          position="right"
          total={total}
          value={value}
          siblings={1}
          boundaries={1}
          onChange={onChange}
          withControls
          withEdges
          noWrap
        />
      ) : undefined,
    [total, onChange, value]
  )

  return (
    <Root scrollRef={viewportRef} verticalAlign={verticalAlign} header={header} footer={footer}>
      {(page.data ?? []).map((item, index) => (
        <tr key={item.id}>{row(item, index, page.index)}</tr>
      ))}
    </Root>
  )
}

Table.Root = Root
Table.Th = Th
Table.Actions = Actions
