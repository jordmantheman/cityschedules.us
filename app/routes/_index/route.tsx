import type { Address } from '../../address-store.server'
import {
  Button,
  Card,
  Group,
  List,
  ListItem,
  Stack,
  Text,
  Title,
  Transition,
  rem,
} from '@mantine/core'
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/cloudflare'
import { json, redirect } from '@remix-run/cloudflare'
import { useFetcher, useFetchers, useLoaderData } from '@remix-run/react'
import { IconRecycle, IconTextPlus, IconTrash } from '@tabler/icons-react'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { AddressStore } from '../../address-store.server'

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
    addresses: store.list(),
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
  const { addresses } = useLoaderData<typeof loader>()
  const fetchers = useFetchers()

  const updating = fetchers.some((fetcher) => fetcher.state === 'submitting')

  return (
    <Stack justify="center" align="center">
      <Title order={1}>Your Addresses</Title>
      <List spacing="sm" listStyleType="none">
        {addresses.map((address) => (
          <AddressListItem
            key={address.id}
            address={address}
            updating={updating}
          />
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

interface AddressListItemProps {
  address: Address
  updating: boolean
}

function AddressListItem({
  updating,
  address: {
    id,
    streetNumber,
    streetName,
    streetDirection,
    streetType,
    unitNumber,
    city,
    state,
  },
}: AddressListItemProps) {
  const fetcher = useFetcher({ key: `delete-address-${id}` })

  return (
    <Transition mounted={fetcher.state === 'idle'}>
      {(styles) => (
        <ListItem>
          <Card padding="lg" radius="md" withBorder w="320px" style={styles}>
            <Card.Section>
              <Title order={3}>
                {streetNumber} {streetDirection} {streetName} {streetType}{' '}
                {unitNumber ? `#${unitNumber}` : ''} {city}, {state}
              </Title>
            </Card.Section>
            <Card.Section py="xl">
              <Group justify="center">
                <IconRecycle size="54" />
                <IconTrash size="54" />
              </Group>
            </Card.Section>
            <Card.Section inheritPadding>
              <Text>
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Text>
            </Card.Section>
            <Card.Section>
              <fetcher.Form method="post">
                <input type="hidden" name="id" value={id} />
                <Button
                  type="submit"
                  value="delete"
                  disabled={updating}
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
          </Card>{' '}
        </ListItem>
      )}
    </Transition>
  )
}
