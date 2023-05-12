import React from 'react'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'
import { SimpleGrid, Switch, useMantineTheme } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons-react'

import { Site } from '@/api'

type BroadcastProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>
  sites: Site[]
}

export const Broadcast = <TFieldValues extends FieldValues = FieldValues>({
  control,
  sites,
}: BroadcastProps<TFieldValues>) => {
  const theme = useMantineTheme()

  return (
    <Controller
      name={'broadcast' as FieldPath<TFieldValues>}
      control={control}
      render={({ field }) => (
        <Switch.Group size="md" defaultValue={field.value} onChange={field.onChange}>
          <SimpleGrid cols={2} spacing="sm" verticalSpacing="sm" breakpoints={[{ maxWidth: 'xs', cols: 1 }]}>
            {sites.map((site) => (
              <Switch
                key={site.id}
                label={site.title}
                value={site.id}
                thumbIcon={
                  field.value?.includes(site.id) ? (
                    <IconCheck size="0.8rem" color={theme.colors.teal[theme.fn.primaryShade()]} stroke={3} />
                  ) : (
                    <IconX size="0.8rem" color={theme.colors.red[theme.fn.primaryShade()]} stroke={3} />
                  )
                }
              />
            ))}
          </SimpleGrid>
        </Switch.Group>
      )}
    />
  )
}
