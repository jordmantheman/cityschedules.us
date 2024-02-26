import {
  AspectRatio,
  Button,
  Card,
  Group,
  Overlay,
  Text,
  Title,
  rem,
} from '@mantine/core'
import { useFetcher } from '@remix-run/react'
import { IconRecycle, IconTrash } from '@tabler/icons-react'
import { format, getWeek, isBefore, isSameDay, isSameWeek } from 'date-fns'
import React from 'react'
import classes from './trash-pickup-card.module.css'
import { type Address } from '../../address-store.server'

export const fetcherDeleteKey = (id: string) => `delete-address-${id}`

/**
 * Performs a best guess approximation to type guard the event type.
 * This is needed because the event is fetched asynchronously.
 */
export const isValidEvent = (
  event: any,
): event is TrashPickupCardProps['event'] => {
  return (
    event?.date instanceof Date ||
    (typeof event?.date === 'string' && !isNaN(new Date(event.date).getDate()))
  )
}

export interface TrashPickupCardProps {
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
  address,
}: TrashPickupCardProps) {
  const fetcher = useFetcher({ key: fetcherDeleteKey(address.id) })

  return (
    <Card padding="lg" radius="md" w="320px">
      <SplashSection>
        <Group justify="center" className={classes.overlay}>
          {trash && <IconTrash size="150" color="gray" />}
          {recycle && <IconRecycle size="150" color="green" />}
        </Group>
      </SplashSection>
      <AddressSection {...address} />
      <Card.Section inheritPadding>
        <RelativeDate baseDate={baseDate} date={date} />
      </Card.Section>
      <Card.Section>
        <fetcher.Form method="post">
          <input type="hidden" name="id" value={address.id} />
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

function SplashSection({ children }: { children?: React.ReactNode }) {
  return (
    <Card.Section mt="-lg" className={classes['icon-section']}>
      <AspectRatio ratio={16 / 9}>{children}</AspectRatio>
    </Card.Section>
  )
}

function AddressSection({
  streetNumber,
  streetName,
  streetDirection,
  streetType,
  unitNumber,
  city,
  state,
}: Address) {
  return (
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

export interface LoadingTrashPickupCardProps {
  address: Address
  error?: string
}

export function ErrorTrashPickupCard({
  address,
  error,
}: LoadingTrashPickupCardProps) {
  const fetcher = useFetcher({ key: fetcherDeleteKey(address.id) })

  if (error) {
    console.error('error fetching schedule', {
      address,
      reason: error,
    })
  }

  return (
    <Card padding="lg" radius="md" w="320px">
      <SplashSection>
        <Overlay
          gradient="linear-gradient(145deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0) 100%)"
          blur={15}
        >
          <Text tt="uppercase" c="white">
            Something went wrong
          </Text>
        </Overlay>
      </SplashSection>
      <AddressSection {...address} />
      <Card.Section inheritPadding>
        <fetcher.Form method="post">
          <input type="hidden" name="id" value={address.id} />
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
