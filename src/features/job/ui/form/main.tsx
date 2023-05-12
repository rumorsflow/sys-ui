import React, { useMemo } from 'react'
import { Control, FieldErrors, FieldPath, FieldValues, UseFormRegister, useFormState, useWatch } from 'react-hook-form'
import { Group, SimpleGrid, TextInput } from '@mantine/core'

import { jobNameSource, languagesSource } from '@/config'
import { JOB_NAMES, Site } from '@/api'
import { Select, Switch } from '@/ui'

type MainProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>
  register: UseFormRegister<TFieldValues>
  sites: Site[]
}

const message = <TFieldValues extends FieldValues = FieldValues>(
  errors: FieldErrors<TFieldValues>,
  name: string,
  value: string
) =>
  ((errors.payload as FieldErrors<TFieldValues>)?.[name]?.message as string | undefined)?.replace(
    `payload.${name}`,
    value
  ) as string | undefined

export const Main = <TFieldValues extends FieldValues = FieldValues>({
  control,
  register,
  sites,
}: MainProps<TFieldValues>) => {
  const watchName = useWatch<TFieldValues>({ control, name: 'name' as FieldPath<TFieldValues> })
  const { errors } = useFormState({ control })
  const siteSource = useMemo(
    () =>
      sites.map((s) => ({
        value: s.id,
        label: s.title,
      })),
    [sites]
  )

  return (
    <>
      <SimpleGrid cols={2} spacing="sm" verticalSpacing="sm" breakpoints={[{ maxWidth: 'xs', cols: 1 }]}>
        <TextInput
          size="md"
          label="Cron expression"
          placeholder="Job cron expression"
          error={errors.cron_expr?.message as string | undefined}
          {...register('cron_expr' as FieldPath<TFieldValues>)}
          withAsterisk
        />
        <Select
          name={'name' as FieldPath<TFieldValues>}
          label="Name"
          placeholder="Pick name"
          data={jobNameSource}
          error={errors.name?.message as string | undefined}
          control={control}
          withAsterisk
        />
        <Select
          name={'payload.site_id' as FieldPath<TFieldValues>}
          label="Site"
          placeholder="Pick site"
          data={siteSource}
          error={message(errors, 'site_id', 'Site')}
          control={control}
          searchable
          withAsterisk
        />
        {watchName === JOB_NAMES[0] ? (
          <TextInput
            size="md"
            label="Feed link"
            placeholder="Job feed link"
            error={message(errors, 'link', 'Feed link')}
            {...register('payload.link' as FieldPath<TFieldValues>)}
            withAsterisk
          />
        ) : (
          <>
            <TextInput
              size="md"
              label="Sitemap link"
              placeholder="Job sitemap link"
              error={message(errors, 'link', 'Sitemap link')}
              {...register('payload.link' as FieldPath<TFieldValues>)}
              withAsterisk
            />
            <Select
              name={'payload.lang' as FieldPath<TFieldValues>}
              label="Sitemap language"
              placeholder="Pick sitemap language"
              data={languagesSource}
              error={message(errors, 'lang', 'Sitemap language')}
              control={control}
              searchable
            />
            <TextInput
              size="md"
              label="Sitemap match location"
              placeholder="Job sitemap match location"
              error={message(errors, 'match_loc', 'Sitemap match location')}
              {...register('payload.match_loc' as FieldPath<TFieldValues>)}
            />
            <TextInput
              size="md"
              label="Sitemap search location"
              placeholder="Job sitemap search location"
              error={message(errors, 'search_loc', 'Sitemap search location')}
              {...register('payload.search_loc' as FieldPath<TFieldValues>)}
            />
            <TextInput
              size="md"
              label="Sitemap search link"
              placeholder="Job sitemap search link"
              error={message(errors, 'search_link', 'Sitemap search link')}
              {...register('payload.search_link' as FieldPath<TFieldValues>)}
            />
          </>
        )}
      </SimpleGrid>
      {watchName === JOB_NAMES[0] ? (
        <Group mt="sm" spacing="sm" position="right">
          <Switch label="Enabled" name={'enabled' as FieldPath<TFieldValues>} control={control} />
        </Group>
      ) : (
        <Group mt="sm" spacing="sm" position="apart">
          <Group spacing="sm">
            <Switch label="Is Index" name={'payload.index' as FieldPath<TFieldValues>} control={control} />
            <Switch label="Stop on dup" name={'payload.stop_on_dup' as FieldPath<TFieldValues>} control={control} />
          </Group>
          <Switch label="Enabled" name={'enabled' as FieldPath<TFieldValues>} control={control} />
        </Group>
      )}
    </>
  )
}
