import { Button, List, ListItem, Stack, Title } from '@mantine/core'
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/cloudflare'
import { json, redirect } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { IconTextPlus } from '@tabler/icons-react'
import { zip } from 'lodash'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import {
  ErrorTrashPickupCard,
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

  const today = new Date()

  const events = await Promise.allSettled(
    addresses.map((address) => getNextWasteEvent({ address, initial: today })),
  )

  return json({
    today,
    cards: zip(addresses, events).map(([address, event]) => ({
      address,
      event: event?.status === 'fulfilled' ? event.value : null,
      error: event?.status === 'rejected' ? event.reason : null,
    })),
  })
}

const deleteSchema = zfd.formData({
  id: zfd.text(z.string()),
})

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method === 'POST') {
    const { id } = deleteSchema.parse(await request.formData())
    const store = await AddressStore.parse(request)
    store.remove(id)
    return json({}, { headers: { 'Set-Cookie': await store.serialize() } })
  }

  return {}
}

export default function Index() {
  const { today, cards } = useLoaderData<typeof loader>()

  return (
    <Stack justify="center" align="center">
      <Title order={1}>Your Addresses</Title>
      <List spacing="sm" listStyleType="none">
        {cards.map(
          ({ address, event }) =>
            address && (
              <ListItem key={address!.id}>
                {isValidEvent(event) ? (
                  <TrashPickupCard
                    baseDate={today}
                    event={event}
                    address={address}
                  />
                ) : (
                  <ErrorTrashPickupCard address={address} />
                )}
              </ListItem>
            ),
        )}
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
