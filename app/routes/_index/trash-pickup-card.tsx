import {
  AspectRatio,
  Button,
  Card,
  Group,
  Text,
  Title,
  rem,
} from '@mantine/core'
import { useFetcher } from '@remix-run/react'
import { IconRecycle, IconTrash } from '@tabler/icons-react'
import { format, getWeek, isBefore, isSameDay, isSameWeek } from 'date-fns'
import classes from './trash-pickup-card.module.css'
import { type Address } from '../../address-store.server'

export const fetcherDeleteKey = (id: string) => `delete-address-${id}`

export interface AddressCardProps {
  baseDate: Date | string
  event: {
    trash?: boolean
    recycle?: boolean
    date: Date | string
  }
  address: Address
}

export function TrashPickupCard({
  baseDate,
  event: { trash, recycle, date },
  address: {
    streetNumber,
    streetName,
    streetDirection,
    streetType,
    unitNumber,
    city,
    state,
    id,
  },
}: AddressCardProps) {
  const fetcher = useFetcher({ key: fetcherDeleteKey(id) })

  return (
    <Card padding="lg" radius="md" withBorder w="320px">
      <Card.Section className={classes['icon-section']}>
        <AspectRatio ratio={16 / 9}>
          <Group justify="center" className={classes.overlay}>
            <IconTrash size="150" color="gray" />
            <IconRecycle size="150" color="green" />
          </Group>
        </AspectRatio>
      </Card.Section>
      <Card.Section inheritPadding>
        <Title order={3}>
          {streetNumber} {streetDirection} {streetName} {streetType}
          <br />
          {unitNumber && `#${unitNumber}`}
        </Title>
        <Text tt="uppercase">
          {city}, {state}
        </Text>
      </Card.Section>
      <Card.Section inheritPadding>
        <RelativeDate baseDate={baseDate} date={date} />
      </Card.Section>
      <Card.Section>
        <fetcher.Form method="post">
          <input type="hidden" name="id" value={id} />
          <Button
            type="submit"
            value="delete"
            fullWidth
            variant="subtle"
            size="xs"
            leftSection={
              <IconTrash style={{ width: rem(16), height: rem(16) }} />
            }
          >
            Remove
          </Button>
        </fetcher.Form>
      </Card.Section>
    </Card>
  )
}

function RelativeDate({
  date,
  baseDate,
}: {
  date: string | Date
  baseDate: string | Date
}) {
  const formatted = format(date, 'EEEE, MMMM do')

  if (isSameDay(date, baseDate)) {
    return <Text>Today</Text>
  } else if (isSameWeek(date, baseDate)) {
    if (isBefore(date, baseDate)) {
      return <Text>This past {formatted}</Text>
    } else {
      return <Text>This {formatted}</Text>
    }
  } else if (isBefore(date, baseDate)) {
    return <Text>{format(date, 'EEEE, MMMM do')}</Text>
  } else if (getWeek(date) === getWeek(baseDate) + 1) {
    return <Text>Next {formatted}</Text>
  } else {
    return <Text>{formatted}</Text>
  }
}
