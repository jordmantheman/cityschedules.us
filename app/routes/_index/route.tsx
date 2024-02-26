import {
  AppShell,
  Burger,
  Grid,
  Group,
  List,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { zip } from 'lodash'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import {
  ErrorTrashPickupCard,
  TrashPickupCard,
  isValidEvent,
} from './trash-pickup-card'
import { WelcomeModal } from './welcome-modal'
import { AddressStore } from '../../address-store.server'
import { getNextWasteEvent } from '../../data'
import { NavBar, ResponsiveAddAddressButton } from '../../shared'

export const meta: MetaFunction = () => {
  return [
    {
      title:
        'US City Trash and Recycle Schedules: Find Your Local Pickup Dates',
    },
    {
      name: 'description',
      content:
        'Tired of missing trash and recycling pickup? Add your address to see your local waste collection schedule. We remember it for next time.',
    },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const store = await AddressStore.parse(request)

  const addresses = store.list()

  const today = new Date()

  const events = await Promise.allSettled(
    addresses.map((address) => getNextWasteEvent({ address, initial: today })),
  )

  const errors = events
    .map((event) => event.status === 'rejected' && event.reason)
    .filter(Boolean)

  if (errors) {
    console.error('Error fetching events', errors)
  }

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
  const [opened, { toggle }] = useDisclosure()

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 150,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      withBorder={false}
    >
      <AppShell.Header>
        <Grid overflow="hidden" align="center">
          <Grid.Col span={1} hiddenFrom="sm">
            <Burger opened={opened} onClick={toggle} size="sm" />
          </Grid.Col>
          <Grid.Col span={11}>
            <Text truncate="end" component={Title} order={1} miw={0}>
              Find Your Local Trash & Recycle Dates
            </Text>
          </Grid.Col>
        </Grid>
      </AppShell.Header>
      <NavBar />
      <AppShell.Main>
        <WelcomeModal opened={cards.length === 0} />
        <Stack>
          <Text>Remember addresses for your home or business.</Text>
          <Group
            align="center"
            renderRoot={(props) => (
              <List {...props} spacing="sm" listStyleType="none" />
            )}
          >
            {cards.map(
              ({ address, event, error }) =>
                address && (
                  <List.Item key={address!.id} m={0}>
                    {isValidEvent(event) ? (
                      <TrashPickupCard
                        baseDate={today}
                        event={event}
                        address={address}
                      />
                    ) : (
                      <ErrorTrashPickupCard address={address} error={error} />
                    )}
                  </List.Item>
                ),
            )}
          </Group>
        </Stack>
        <ResponsiveAddAddressButton fab />
      </AppShell.Main>
    </AppShell>
  )
}
