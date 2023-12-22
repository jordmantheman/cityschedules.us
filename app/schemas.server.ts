/**
 * A collection of zod schema primitives to be shared throughout the app.
 */
import { z } from 'zod'
import { StreetDirection, StreetType } from './enums'

export const streetDirection = z.nativeEnum(StreetDirection)
export const streetName = z.string().min(1)
export const streetNumber = z.number().min(1).max(99999)
export const streetType = z.nativeEnum(StreetType)
export const unitNumber = z.number().min(1).max(99999)
export const city = z.string().min(1)
export const state = z.string().length(2).toUpperCase()
