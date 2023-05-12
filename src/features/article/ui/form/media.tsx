import React from 'react'
import {
  Control,
  FieldPath,
  FieldValues,
  useFieldArray,
  FieldArrayPath,
  UseFormRegister,
  FieldArray,
  ArrayPath,
  useWatch,
} from 'react-hook-form'
import { Card, createStyles, rem, SimpleGrid, Image, Textarea, Button, Group } from '@mantine/core'
import { IconPlus, IconTrash } from '@tabler/icons-react'

import { ArticleMedia } from '@/api'

const useStyles = createStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  image: {
    overflow: 'hidden',
    height: rem(150),

    '& .mantine-Image-placeholder': {
      height: rem(150),
    },
  },

  input: {
    flexGrow: 1,

    '& .mantine-Textarea-input': {
      padding: theme.spacing.sm,
    },
  },

  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`,
  },
}))

type MediaProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>
  register: UseFormRegister<TFieldValues>
}

const emptyMedia: ArticleMedia[] = []

export const Media = <TFieldValues extends FieldValues = FieldValues>({
  control,
  register,
}: MediaProps<TFieldValues>) => {
  const { classes } = useStyles()
  const { fields, append, remove } = useFieldArray<TFieldValues, FieldArrayPath<TFieldValues>>({
    control,
    name: 'media' as ArrayPath<TFieldValues>,
  })
  const watchMedia = useWatch({ control, name: 'media' as FieldPath<TFieldValues> }) ?? emptyMedia
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchMedia[index],
    }
  })

  return (
    <SimpleGrid cols={2} spacing="sm" verticalSpacing="sm" breakpoints={[{ maxWidth: 'xs', cols: 1 }]}>
      {controlledFields.map((field, index) => (
        <Card key={field.id} className={classes.card} padding={0} withBorder>
          <Card.Section className={classes.image}>
            <Image src={field.url || null} alt="no image" withPlaceholder />
          </Card.Section>

          <Textarea
            {...register(`media.${index}.url` as FieldPath<TFieldValues>)}
            className={classes.input}
            variant="unstyled"
            minRows={5}
            maxRows={5}
            autosize
          />

          <Card.Section className={classes.footer}>
            <Button
              variant="light"
              color="red"
              leftIcon={<IconTrash stroke={1.5} />}
              onClick={() => remove(index)}
              radius={0}
              sx={{ flexGrow: 1 }}
            >
              delete
            </Button>
          </Card.Section>
        </Card>
      ))}
      <Group position="left" align="flex-start">
        <Button
          variant="default"
          size="md"
          leftIcon={<IconPlus stroke={1.5} />}
          onClick={() => append({ type: 'image', url: '' } as FieldArray<TFieldValues, FieldArrayPath<TFieldValues>>)}
        >
          new image
        </Button>
      </Group>
    </SimpleGrid>
  )
}
