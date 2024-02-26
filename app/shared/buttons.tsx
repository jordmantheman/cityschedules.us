import { ActionIcon, Affix, Box, Button, Group } from '@mantine/core'
import { IconArrowRight, IconTextPlus } from '@tabler/icons-react'

export interface ResponsiveAddAddressButtonProps {
  /**
   * When set the button will be a floating action button.
   */
  fab?: boolean
}

export function ResponsiveAddAddressButton({
  fab,
}: ResponsiveAddAddressButtonProps) {
  if (fab) {
    return (
      <Affix hiddenFrom="sm" position={{ bottom: 40, right: 40 }}>
        <ActionIcon
          radius="lg"
          size={60}
          aria-label="Add an address"
          component="a"
          href="/wi/madison"
        >
          <IconTextPlus size="24" />
        </ActionIcon>
      </Affix>
    )
  }

  return (
    <ActionIcon
      visibleFrom="sm"
      radius="lg"
      size={60}
      aria-label="Add an address"
      component="a"
      href="/wi/madison"
    >
      <IconTextPlus size="24" />
    </ActionIcon>
  )
}

export function AddFirstAddressButton() {
  return (
    <Button
      component="a"
      href="/wi/madison"
      leftSection={<IconTextPlus size="24" />}
      rightSection={<IconArrowRight size={14} />}
    >
      Add your first address!
    </Button>
  )
}
