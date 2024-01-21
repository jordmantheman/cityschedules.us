/**
 * This file contains all of the cookies that we use in our application.
 *
 * addresses:
 *  The addresses cookie contains a list of addresses that the user has saved.
 *  The user can manage their addresses in the app, and we'll store them here.
 */
import { createCookie } from '@remix-run/cloudflare'
import { customAlphabet } from 'nanoid/non-secure'
import { z } from 'zod'
import * as AddressSchema from './schemas.server'

/**
 * This is how a single address is stored in our cookie.
 */
const addressSchema = z.object({
  id: z.string().length(10),
  streetDirection: AddressSchema.streetDirection.optional(),
  streetName: AddressSchema.streetName,
  streetNumber: AddressSchema.streetNumber,
  streetType: AddressSchema.streetType.optional(),
  unitNumber: AddressSchema.unitNumber.optional(),
  city: AddressSchema.city,
  state: AddressSchema.state,
})

/**
 * This is what we expect our entire cookie to look like.
 */
const addressCookieSchema = z.object({
  addresses: z.array(addressSchema),
})

export type AddressCookie = z.infer<typeof addressCookieSchema>
export type Address = z.infer<typeof addressSchema>

/**
 * The AddressStore class is a wrapper around a remix cookie.
 * It provides a convenient public interface for working with the cookie so we don't
 * need to scatter business logic throughout our application.
 */
export class AddressStore {
  /**
   * We use nanoid to generate a unique ID for each address.
   * This is unique per user, so we don't really need to worry about collisions.
   */
  static nanoid = customAlphabet('0123456789abcdef', 10)

  private addresses: Address[]

  constructor({ addresses }: AddressCookie) {
    this.addresses = addresses.map((address) => ({ ...address }))
  }

  /**
   * Add a new address to the store.
   */
  public add({
    streetDirection,
    streetName,
    streetNumber,
    streetType,
    unitNumber,
    city,
    state,
  }: Omit<Address, 'id'>) {
    this.addresses = [
      ...this.addresses,
      {
        id: AddressStore.nanoid(),
        streetDirection,
        streetName,
        streetNumber,
        streetType,
        unitNumber,
        city,
        state,
      },
    ]
  }

  /**
   * Remove an address from the store.
   */
  public remove(id: string) {
    this.addresses = this.addresses.filter((address) => address.id !== id)
  }

  /**
   * Move an address to a new location in the store.
   */
  public move(id: string, index: number) {
    const address = this.addresses.find((address) => address.id === id)
    if (!address) return

    const tmp = this.addresses.filter((address) => address.id !== id)
    tmp.splice(index, 0, address)
    this.addresses = tmp
  }

  /**
   * List the addresses in the store.
   */
  public list(): readonly Address[] {
    return this.addresses
  }

  /**
   * This store is backed by a cookie, so don't forget to serialize it into the
   * response headers.
   *
   *   return redirect("/", {
   *     headers: {
   *       "Set-Cookie": await store.serialize(),
   *     },
   *   });
   *
   */
  async serialize(): Promise<string> {
    return addressCookie.serialize({ addresses: this.addresses })
  }

  /**
   * Instantiate existing AddressStore from a request.
   * Creates a new one if it does not exist.
   */
  static async parse(request: Request) {
    return new AddressStore(
      (await addressCookie.parse(request.headers.get('Cookie'))) ?? {
        addresses: [],
      },
    )
  }
}

const addressCookie = createCookie('addresses', {
  path: '/',
  // lax allows us to apply the cookie when being linked to from an external site
  sameSite: 'lax',
  httpOnly: true,
  secure: true,
  // chrome max is 400 days, so let's normalize to that
  maxAge: 60 * 60 * 24 * 400,
})
