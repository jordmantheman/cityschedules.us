import type { MadisonAddress } from './remote'
import type { Address } from '../../../address-store.server'
import { MadisonAddressSchema, fetchSchedule } from './remote'
import { getNextWasteEvent } from './trash-recycle-schedule'

export const getNextWasteEventForMadisonWisconsin = async (
  address: Address,
  initial: Date,
) => {
  const schedule = await fetchSchedule(
    MadisonAddressSchema.parse({
      HouseNum: address.streetNumber.toString(),
      StName: address.streetName,
      StType: address.streetType,
      StDir: address.streetDirection,
      Unit: address.unitNumber?.toString(),
    } as MadisonAddress),
  )

  return getNextWasteEvent(initial, schedule)
}
