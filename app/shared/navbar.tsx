import { AppShell, Divider, List, Text } from '@mantine/core'
import { ResponsiveAddAddressButton } from './buttons'

/**
 * @returns a List of cities by state
 */
export function ListOfCitiesByState() {
  return (
    <List spacing="md" listStyleType="none">
      <List.Item>
        Wisconsin
        <List withPadding spacing="none" listStyleType="none">
          <List.Item>
            <a href="/wi/madison">Madison</a>
          </List.Item>
        </List>
      </List.Item>
    </List>
  )
}

/**
 * @returns the AppShell.NavBar component
 */
export function NavBar() {
  return (
    <AppShell.Navbar px="sm">
      <ResponsiveAddAddressButton />
      <Text>Locations</Text>
      <Divider />
      <ListOfCitiesByState />
    </AppShell.Navbar>
  )
}
