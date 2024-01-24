import { Button, List, ListItem, Stack, Title } from '@mantine/core'
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/cloudflare'
import { json, redirect } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { IconTextPlus } from '@tabler/icons-react'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { TrashPickupCard } from './trash-pickup-card'
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

  if (store.list().length === 0) {
    return redirect('/wi/madison')
  }

  return json({
    today: new Date(),
    cards: store.list().map((address) => ({
      address,
      // TODO: fetch this with a POST
      event: getNextWasteEvent(new Date(), 'tueB'),
    })),
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

export default function Index() {
  const { today, cards } = useLoaderData<typeof loader>()

  return (
    <Stack justify="center" align="center">
      <Title order={1}>Your Addresses</Title>
      <List spacing="sm" listStyleType="none">
        {cards.map(({ address, event }) => (
          <ListItem key={address.id}>
            <TrashPickupCard baseDate={today} event={event} address={address} />
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
