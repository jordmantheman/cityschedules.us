import type { HTMLFormMethod } from '@remix-run/router'
import {
  Alert,
  Button,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { Form } from '@remix-run/react'
import { IconInfoCircle } from '@tabler/icons-react'
import { StreetDirection, StreetType } from '../../enums'

export interface EnterYourAddressFormProps {
  formProps: {
    action?: string
    method?: HTMLFormMethod
    replace?: boolean
  }
  initialValues?: {
    streetNumber?: number
    streetDirection?: StreetDirection
    streetName?: string
    streetType?: StreetType
    unitNumber?: number
  }
}

export function EnterYourAddressForm({
  formProps,
  initialValues = {},
}: EnterYourAddressFormProps) {
  return (
    <>
      <Title order={1}>Enter Your Address</Title>
      <Form {...formProps}>
        <Stack>
          <NumberInput
            label="Street Number"
            name="streetNumber"
            defaultValue={initialValues.streetNumber}
            maxLength={5}
            minLength={1}
            required
          />

          <Select
            label="Street Direction"
            name="streetDirection"
            defaultValue={initialValues.streetDirection}
            data={Object.entries(streetDirectionOptions).map(
              ([label, value]) => ({ value, label }),
            )}
          />

          <TextInput
            label="Street Name"
            name="streetName"
            defaultValue={initialValues.streetName}
            minLength={1}
            required
          />

          <Select
            label="Street Type"
            name="streetType"
            defaultValue={initialValues.streetType}
            data={Object.entries(streetTypeOptions).map(([label, value]) => ({
              value,
              label,
            }))}
          />

          <NumberInput
            label="Unit Number"
            name="unitNumber"
            defaultValue={initialValues.unitNumber}
            maxLength={5}
            minLength={1}
          />

          <Alert
            variant="light"
            radius="xs"
            title="Need help?"
            icon={<IconInfoCircle />}
          >
            Visit the{' '}
            <a href="https://www.cityofmadison.com/streets/refuse/collectionlookup.cfm">
              Madison Streets division
            </a>{' '}
            collection lookup.
          </Alert>

          <Button type="submit" fullWidth>
            Submit
          </Button>
        </Stack>
      </Form>
    </>
  )
}

const streetTypeOptions = {
  Alley: StreetType.Alley,
  Avenue: StreetType.Avenue,
  Boulevard: StreetType.Boulevard,
  Bend: StreetType.Bend,
  Circle: StreetType.Circle,
  Crescent: StreetType.Crescent,
  Court: StreetType.Court,
  Drive: StreetType.Drive,
  Glen: StreetType.Glen,
  Green: StreetType.Green,
  Heights: StreetType.Heights,
  Highway: StreetType.Highway,
  Lane: StreetType.Lane,
  Loop: StreetType.Loop,
  Mall: StreetType.Mall,
  Pass: StreetType.Pass,
  Path: StreetType.Path,
  Parkway: StreetType.Parkway,
  Place: StreetType.Place,
  Plaza: StreetType.Plaza,
  Ramp: StreetType.Ramp,
  Road: StreetType.Road,
  Ridge: StreetType.Ridge,
  Row: StreetType.Row,
  RR: StreetType.RR,
  Run: StreetType.Run,
  Spur: StreetType.Spur,
  Square: StreetType.Square,
  Street: StreetType.Street,
  Terrace: StreetType.Terrace,
  Trace: StreetType.Trace,
  Trail: StreetType.Trail,
  View: StreetType.View,
  Walk: StreetType.Walk,
  Way: StreetType.Way,
  Crossing: StreetType.Crossing,
} as const

const streetDirectionOptions = {
  North: StreetDirection.North,
  South: StreetDirection.South,
  East: StreetDirection.East,
  West: StreetDirection.West,
} as const
