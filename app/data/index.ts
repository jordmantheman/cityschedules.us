/**
 * This file is used to facade over the data layer, but we only have one city, so let's
 * not work too hard building the abstraction.
 */
export {
  getNextWasteEvent,
  isValidSchedule,
} from './wi/madison/trash-recycle-schedule'

export interface CalendarEvent {
  date: Date
  recycle?: boolean
  trash?: boolean
}
