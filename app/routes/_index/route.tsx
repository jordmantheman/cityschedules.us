import type { CalendarEvent } from '../../data'
import { Button, List, ListItem, Stack, Title } from '@mantine/core'
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/cloudflare'
import { defer, json, redirect } from '@remix-run/cloudflare'
import { Await, useLoaderData } from '@remix-run/react'
import { IconTextPlus } from '@tabler/icons-react'
import { chain } from 'lodash'
import { Suspense } from 'react'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import {
  LoadingTrashPickupCard,
  TrashPickupCard,
  isValidEvent,
} from './trash-pickup-card'
import { AddressStore } from '../../address-store.server'
import { getNextWasteEvent } from '../../data'

export const meta: MetaFunction = () => {
  return [
    { title: 'Trash and Recycling Pickup Schedules.' },
    {
      name: 'description',
      content:
        'Enter your address to see a (more) helpful schedule for browsing your trash and recycle services.',
    },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const store = await AddressStore.parse(request)

  const addresses = store.list()

  if (addresses.length === 0) {
    throw redirect('/wi/madison')
  }

  const calendarEventsByAddressId = chain(addresses)
    .keyBy('id')
    .mapValues(
      (address) =>
        new Promise<CalendarEvent>((resolve) =>
          setTimeout(
            () => resolve(getNextWasteEvent(new Date(), 'tueB')),
            Math.random(),
          ),
        ),
    )
    .value()

  return defer({
    today: new Date(),
    cards: addresses.map((address) => ({ address })),
    ...calendarEventsByAddressId,
  })
}

const deleteSchema = zfd.formData({
  id: zfd.text(z.string()),
})

export const action = async ({ request, params }: ActionFunctionArgs) => {
  if (request.method === 'POST') {
    const { id } = deleteSchema.parse(await request.formData())
    const store = await AddressStore.parse(request)
    store.remove(id)
    return json({}, { headers: { 'Set-Cookie': await store.serialize() } })
  }

  return {}
}

/**
 * Extracts all of the promises from the loader data and returns them as a Record<string, Promise<CalendarEvent>>
 */
const getPromises = (obj: object): Map<string, Promise<CalendarEvent>> =>
  new Map(Object.entries(obj).filter(([, v]) => v instanceof Promise))

export default function Index() {
  const { today, cards, ...rest } = useLoaderData<typeof loader>()

  const promises = getPromises(rest)

  const cardsAndPromises = cards
    .filter(({ address }) => promises.has(address.id))
    .map(({ address }) => ({
      address,
      eventPromise: promises.get(address.id)!,
    }))

  return (
    <Stack justify="center" align="center">
      <Title order={1}>Your Addresses</Title>
      <List spacing="sm" listStyleType="none">
        {cardsAndPromises.map(({ address, eventPromise }) => (
          <ListItem key={address.id}>
            <Suspense fallback={<LoadingTrashPickupCard address={address} />}>
              <Await resolve={eventPromise}>
                {(event) =>
                  isValidEvent(event) ? (
                    <TrashPickupCard
                      baseDate={today}
                      event={event}
                      address={address}
                    />
                  ) : null
                }
              </Await>
            </Suspense>
          </ListItem>
        ))}
      </List>
      <Button
        component="a"
        href="/wi/madison"
        variant="filled"
        size="lg"
        radius="xl"
        leftSection={<IconTextPlus size="24" />}
      >
        Add an address
      </Button>
    </Stack>
  )
}
