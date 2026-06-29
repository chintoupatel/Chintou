import { DESIGN_TOKENS } from '@/lib/config/designTokens'

const { dimensions, spacing } = DESIGN_TOKENS

type Props = {
  as?: 'section' | 'footer'
  id?: string
  isMobile: boolean
  background?: string
  children: React.ReactNode
  style?: React.CSSProperties
  innerRef?: React.Ref<HTMLElement>
  onMouseMove?: React.MouseEventHandler<HTMLElement>
}

export function SectionShell({ as = 'section', id, isMobile, background, children, style, innerRef, onMouseMove }: Props) {
  const Tag = as as 'section'
  return (
    <Tag
      id={id}
      ref={innerRef}
      onMouseMove={onMouseMove}
      style={{
        maxWidth: dimensions.container,
        margin: '0 auto',
        padding: isMobile ? '64px 24px' : `${spacing.sectionPadding} ${spacing.containerPadding}`,
        ...(background ? { background } : {}),
        ...style,
      }}
    >
      {children}
    </Tag>
  )
}
