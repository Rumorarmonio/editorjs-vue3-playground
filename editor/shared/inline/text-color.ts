export const textColorInlineClassName = 'editor-text-color'

export const textColorInlineOptions = [
  {
    name: 'accent',
    label: 'Accent',
    className: 'editor-text-color--accent',
    value: '#0f766e',
  },
  {
    name: 'danger',
    label: 'Danger',
    className: 'editor-text-color--danger',
    value: '#b42318',
  },
  {
    name: 'muted',
    label: 'Muted',
    className: 'editor-text-color--muted',
    value: '#5e6268',
  },
] as const

export type TextColorInlineName = (typeof textColorInlineOptions)[number]['name']

export type TextColorInlineOption = (typeof textColorInlineOptions)[number]

export const textColorInlineClassNames = [
  textColorInlineClassName,
  ...textColorInlineOptions.map((option) => option.className),
]

export function getTextColorInlineOption(
  name: string | null | undefined,
): TextColorInlineOption {
  return (
    textColorInlineOptions.find((option) => option.name === name) ??
    textColorInlineOptions[0]
  )
}

export function getTextColorInlineOptionByClassName(
  classList: DOMTokenList | string[],
): TextColorInlineOption | null {
  return (
    textColorInlineOptions.find((option) =>
      Array.from(classList).includes(option.className),
    ) ?? null
  )
}
