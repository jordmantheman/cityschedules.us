import { type MetaFunction } from '@remix-run/cloudflare'

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

export default function Index() {
  return null
}
