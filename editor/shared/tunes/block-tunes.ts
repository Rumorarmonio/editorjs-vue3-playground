export const editorBlockTuneNames = [
  'anchor',
  'spacing',
  'label',
  'animation',
] as const

export type EditorBlockTuneName = (typeof editorBlockTuneNames)[number]

export interface AnchorTuneData {
  anchor?: string
}

export type SpacingTuneValue = 'none' | 'small' | 'medium' | 'large'

export interface SpacingTuneData {
  top?: SpacingTuneValue
  bottom?: SpacingTuneValue
}

export interface LabelTuneData {
  label?: string
}

export type AnimationTuneValue = 'none' | 'fade-up' | 'fade-left' | 'fade-right'

export interface AnimationTuneData {
  type?: AnimationTuneValue
}

export interface KnownEditorBlockTuneData {
  anchor?: AnchorTuneData
  spacing?: SpacingTuneData
  label?: LabelTuneData
  animation?: AnimationTuneData
}

export const spacingTuneValues = [
  'none',
  'small',
  'medium',
  'large',
] as const satisfies readonly SpacingTuneValue[]

export const animationTuneValues = [
  'none',
  'fade-up',
  'fade-left',
  'fade-right',
] as const satisfies readonly AnimationTuneValue[]

const anchorMaxLength = 80
const labelMaxLength = 120

export function normalizeAnchorTuneData(value: unknown): AnchorTuneData {
  if (!isRecord(value)) {
    return {}
  }

  return {
    anchor: normalizeAnchorValue(value.anchor),
  }
}

export function normalizeSpacingTuneData(value: unknown): SpacingTuneData {
  if (!isRecord(value)) {
    return {}
  }

  return {
    top: normalizeSpacingTuneValue(value.top),
    bottom: normalizeSpacingTuneValue(value.bottom),
  }
}

export function normalizeLabelTuneData(value: unknown): LabelTuneData {
  if (!isRecord(value)) {
    return {}
  }

  return {
    label: normalizeLabelValue(value.label),
  }
}

export function normalizeAnimationTuneData(value: unknown): AnimationTuneData {
  if (!isRecord(value)) {
    return {}
  }

  return {
    type: normalizeAnimationTuneValue(value.type),
  }
}

export function getKnownBlockTuneData(
  tunes: Record<string, unknown> | undefined,
): KnownEditorBlockTuneData {
  if (!tunes) {
    return {}
  }

  return {
    anchor: normalizeAnchorTuneData(tunes.anchor),
    spacing: normalizeSpacingTuneData(tunes.spacing),
    label: normalizeLabelTuneData(tunes.label),
    animation: normalizeAnimationTuneData(tunes.animation),
  }
}

export function getDuplicateAnchorValues(
  blocks: { tunes?: Record<string, unknown> }[],
): string[] {
  const anchorCounts = new Map<string, number>()

  blocks.forEach((block) => {
    const anchor = getKnownBlockTuneData(block.tunes).anchor?.anchor

    if (!anchor) {
      return
    }

    anchorCounts.set(anchor, (anchorCounts.get(anchor) ?? 0) + 1)
  })

  return [...anchorCounts]
    .filter(([, count]) => count > 1)
    .map(([anchor]) => anchor)
}

export function isKnownBlockTuneData(value: unknown): boolean {
  if (value === undefined) {
    return true
  }

  if (!isRecord(value)) {
    return false
  }

  return (
    isValidAnchorTuneData(value.anchor) &&
    isValidSpacingTuneData(value.spacing) &&
    isValidLabelTuneData(value.label) &&
    isValidAnimationTuneData(value.animation)
  )
}

export function normalizeAnchorValue(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, anchorMaxLength)

  return normalized || undefined
}

export function normalizeLabelValue(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const normalized = value.trim().replace(/\s+/g, ' ').slice(0, labelMaxLength)

  return normalized || undefined
}

function isValidAnchorTuneData(value: unknown): boolean {
  if (value === undefined) {
    return true
  }

  if (!isRecord(value)) {
    return false
  }

  return (
    value.anchor === undefined ||
    normalizeAnchorValue(value.anchor) === value.anchor
  )
}

function isValidSpacingTuneData(value: unknown): boolean {
  if (value === undefined) {
    return true
  }

  if (!isRecord(value)) {
    return false
  }

  return (
    (value.top === undefined || isSpacingTuneValue(value.top)) &&
    (value.bottom === undefined || isSpacingTuneValue(value.bottom))
  )
}

function isValidLabelTuneData(value: unknown): boolean {
  if (value === undefined) {
    return true
  }

  if (!isRecord(value)) {
    return false
  }

  return (
    value.label === undefined || normalizeLabelValue(value.label) === value.label
  )
}

function isValidAnimationTuneData(value: unknown): boolean {
  if (value === undefined) {
    return true
  }

  if (!isRecord(value)) {
    return false
  }

  return value.type === undefined || isAnimationTuneValue(value.type)
}

function normalizeSpacingTuneValue(
  value: unknown,
): SpacingTuneValue | undefined {
  return isSpacingTuneValue(value) ? value : undefined
}

function normalizeAnimationTuneValue(
  value: unknown,
): AnimationTuneValue | undefined {
  return isAnimationTuneValue(value) ? value : undefined
}

function isSpacingTuneValue(value: unknown): value is SpacingTuneValue {
  return spacingTuneValues.includes(value as SpacingTuneValue)
}

function isAnimationTuneValue(value: unknown): value is AnimationTuneValue {
  return animationTuneValues.includes(value as AnimationTuneValue)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
