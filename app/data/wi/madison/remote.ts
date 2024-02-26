/**
 * This file is responsible for fetching the refuse collection schedule based on
 * a provided city address.
 *
 * The city of Madison, WI provides a form to look up the refuse collection schedule
 * located at https://www.cityofmadison.com/streets/refuse/collectionlookup.cfm.
 *
 * This form will POST to https://www.cityofmadison.com/streets/refuse/collectionResults.cfm
 * with the fields described in the schema below. The response *should* be a 302 redirect
 * with a location header that contains the schedule name in the format of:
 *  https://www.cityofmadison.com/streets/documents/monB.pdf
 */
import { z } from 'zod'

export const MadisonAddressSchema = z.object({
  HouseNum: z.string().min(1).max(5),
  StDir: z.enum(['N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW']).optional(),
  StName: z.string().min(1).max(35),
  StType: z
    .enum([
      'Aly',
      'Ave',
      'Blvd',
      'Bnd',
      'Cir',
      'Cres',
      'Ct',
      'Dr',
      'Gln',
      'Grn',
      'Hts',
      'Hwy',
      'Ln',
      'Loop',
      'Mall',
      'Pass',
      'Path',
      'Pkwy',
      'Pl',
      'Plz',
      'Ramp',
      'Rd',
      'Rdg',
      'Row',
      'RR',
      'Run',
      'Spur',
      'St',
      'Sq',
      'Ter',
      'Trce',
      'Trl',
      'Vw',
      'Walk',
      'Way',
      'Xing',
    ])
    .optional(),
  Unit: z.string().min(1).max(5).optional(),
})

export type MadisonAddress = z.infer<typeof MadisonAddressSchema>

const MadisonSchedules = [
  'monA',
  'monB',
  'tueA',
  'tueB',
  'wedA',
  'wedB',
  'thuA',
  'thuB',
  'ThuC', // Madison has a third Thursday schedule, the casing is NOT a typo
  'friA',
  'friB',
] as const

export type MadisonSchedule = (typeof MadisonSchedules)[number]

export const fetchSchedule = async (
  address: MadisonAddress,
): Promise<MadisonSchedule> => {
  const body = new URLSearchParams()

  // the form requires all fields to be present, even if empty.
  body.set('HouseNum', address.HouseNum)
  body.set('StDir', address.StDir ?? '')
  body.set('StName', address.StName)
  body.set('StType', address.StType ?? '')
  body.set('Unit', address.Unit ?? '')

  const response = await fetch(
    `https://www.cityofmadison.com/streets/refuse/collectionResults.cfm`,
    {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      redirect: 'manual',
    },
  )

  const schedule = parseSchedule(response.headers.get('location'))
  if (!schedule) {
    throw new Error(
      `Invalid schedule: status=${
        response.status
      } schedule=${response.headers.get(
        'location',
      )} text=${await response.text()}`,
    )
  }

  return schedule
}

/**
 * Parses the response location header to extract the schedule name
 * in the format of:
 *  /some/location/monA.pdf
 */
const parseSchedule = (
  location: string | null,
): MadisonSchedule | undefined => {
  const schedule = MadisonSchedules.find(
    (value) => value === location?.match(/([a-zA-Z]*)\.pdf$/i)?.[1],
  )

  return schedule
}
