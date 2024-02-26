import {
  Anchor,
  Breadcrumbs as MantineBreadcrumbs,
  type BreadcrumbsProps as MantineBreadcrumbsProps,
} from '@mantine/core'

export interface BreadcrumbsProps
  extends Omit<MantineBreadcrumbsProps, 'children'> {
  children: {
    title: string
    href?: string
  }[]
}

export const Breadcrumbs = ({ children, ...props }: BreadcrumbsProps) => {
  return (
    <MantineBreadcrumbs {...props}>
      {children.map((item) =>
        item.href ? (
          <Anchor href={item.href} key={item.title}>
            {item.title}
          </Anchor>
        ) : (
          <span key={item.title}>{item.title}</span>
        ),
      )}
    </MantineBreadcrumbs>
  )
}
