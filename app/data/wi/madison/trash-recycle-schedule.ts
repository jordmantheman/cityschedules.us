/**
 * Madison, WI Trash & Recycle Schedules, from https://www.cityofmadison.com/streets/refuse/collectionSchedule.cfm
 *
 * At first glance, it looks like we could just record a huge dataset of dates and their corresponding trash/recycle pickup status,
 * but it ended up being two schedules * 5 days a week * 52 weeks a year = 520 entries. That's just annoying enough to make me
 * write an algorithm, even if Copilot tried to help.
 *
 * TODO: This module still doesn't handle holidays, which can arbitrarily offset a pickup by +1 or -1 day.
 */
import type { MadisonSchedule } from './remote'
import { type Day, getWeek, nextDay } from 'date-fns'

type MadisonCalendarEvent = {
  date: Date
  trash?: boolean
  recycle?: boolean
}

/**
 * The schedule names are the day of the week, followed by the schedule letter.
 * We lowercase the schedule name to make it easier to work with for more permissive matching.
 *
 * K.I.S.S. -- don't parse strings when you don't have to.
 */
const madisonSchedules = new Map<MadisonSchedule, [Day, 'A' | 'B' | 'C']>([
  ['monA', [1, 'A']],
  ['monB', [1, 'B']],
  ['tueA', [2, 'A']],
  ['tueB', [2, 'B']],
  ['wedA', [3, 'A']],
  ['wedB', [3, 'B']],
  ['thuA', [4, 'A']],
  ['thuB', [4, 'B']],
  ['ThuC', [4, 'C']],
  ['friA', [5, 'A']],
  ['friB', [5, 'B']],
])

/**
 * Algorithmically generate the next waste event based on the initial date and schedule.
 * A schedule of 'A' means that the first week of the month is trash only, and the second week is trash and recycle.
 * A schedule of 'B' means that the first week of the month is trash and recycle, and the second week is trash only.
 *
 * Holidays may arbitrarily offset a pickup by +1 or -1 day.
 *
 * @param initial The date to start computing from
 * @param schedule The name of the schedule, e.g. 'monA', 'monB', 'tueA', etc.
 * @returns the next event computed from the provided day, excluding the provided day
 */
export const getNextWasteEvent = (
  initial: Date,
  schedule: MadisonSchedule,
): MadisonCalendarEvent => {
  const [day, sched] = madisonSchedules.get(schedule)!

  // TODO: Implement holiday overrides
  const nextPickupDayExcludingToday = nextDay(initial, day)

  // Get the week offset. Looking at a few calendars, it looks like the A/B rotation is based on the first week including Jan 01,
  // which may overlap with the last week of the previous calendar.
  // NOTE: getWeek start at 1, not 0
  const weekIsEven =
    getWeek(nextPickupDayExcludingToday, {
      firstWeekContainsDate: 1,
    }) %
      2 ===
    0

  if (
    // schedules A and C appear to be the same
    (sched === 'A' && weekIsEven) ||
    (sched === 'C' && weekIsEven) ||
    (sched === 'B' && !weekIsEven)
  ) {
    return { date: nextPickupDayExcludingToday, recycle: true, trash: true }
  } else {
    return { date: nextPickupDayExcludingToday, trash: true }
  }
}
