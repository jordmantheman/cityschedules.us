import { Group, Modal, Stack, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { AddFirstAddressButton } from '../../shared'

/**
 * Opens a modal to add your first address.
 */
export function WelcomeModal({ opened }: { opened: boolean }) {
  const isMobile = useMediaQuery('(max-width: 50em)')

  return (
    <Modal
      opened={opened}
      onClose={() => undefined}
      withCloseButton={false}
      fullScreen={isMobile}
      size="xl"
      title="Welcome!"
      transitionProps={{ transition: 'fade', duration: 200 }}
    >
      <Stack>
        <Text>
          Tired of missing trash and recycling pickup? Add your address to see
          your local waste collection schedule. We'll remember it for next time.
        </Text>
        <Group justify="center">
          <AddFirstAddressButton />
        </Group>
      </Stack>
    </Modal>
  )
}
