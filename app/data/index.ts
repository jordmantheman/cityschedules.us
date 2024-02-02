import type { Address } from '~/address-store.server'
import { getNextWasteEventForMadisonWisconsin } from './wi/madison'

export type CalendarEvent = {
  date: Date
  trash?: boolean
  recycle?: boolean
}

export const getNextWasteEvent = async ({
  address,
  initial = new Date(),
}: {
  address: Address
  initial?: Date
}): Promise<CalendarEvent> => {
  switch (address.state) {
    // This won't scale, but good for now.
    case 'WI':
      switch (address.city) {
        case 'Madison':
          return await getNextWasteEventForMadisonWisconsin(address, initial)
        default:
          throw new Error(`Unsupported city ${address.city}`)
      }
    default:
      throw new Error(`Unsupported state: ${address.state}`)
  }
}
