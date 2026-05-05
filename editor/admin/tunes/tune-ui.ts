export interface TuneFieldOptions {
  label: string
  value: string
  placeholder?: string
  onInput: (value: string) => void
}

export interface TuneSelectOptions {
  label: string
  value: string
  options: readonly {
    label: string
    value: string
  }[]
  onChange: (value: string) => void
}

export interface TuneToggleOptions {
  label: string
  value: boolean
  onChange: (value: boolean) => void
}

export function createTunePanel(title: string): HTMLDivElement {
  const panel = document.createElement('div')
  panel.className = 'editor-block-tune-panel'

  const heading = document.createElement('p')
  heading.className = 'editor-block-tune-panel__title'
  heading.textContent = title

  panel.append(heading)

  return panel
}

export function createTuneTextField({
  label,
  value,
  placeholder,
  onInput,
}: TuneFieldOptions): HTMLLabelElement {
  const field = document.createElement('label')
  field.className = 'editor-block-tune-field'

  const labelElement = document.createElement('span')
  labelElement.className = 'editor-block-tune-field__label'
  labelElement.textContent = label

  const input = document.createElement('input')
  input.className = 'editor-block-tune-field__control'
  input.type = 'text'
  input.value = value
  input.placeholder = placeholder ?? ''

  input.addEventListener('input', () => {
    onInput(input.value)
  })

  field.append(labelElement, input)

  return field
}

export function createTuneSelectField({
  label,
  value,
  options,
  onChange,
}: TuneSelectOptions): HTMLLabelElement {
  const field = document.createElement('label')
  field.className = 'editor-block-tune-field'

  const labelElement = document.createElement('span')
  labelElement.className = 'editor-block-tune-field__label'
  labelElement.textContent = label

  const select = document.createElement('select')
  select.className = 'editor-block-tune-field__control'

  options.forEach((option) => {
    const optionElement = document.createElement('option')
    optionElement.value = option.value
    optionElement.textContent = option.label
    select.append(optionElement)
  })

  select.value = value

  select.addEventListener('change', () => {
    onChange(select.value)
  })

  field.append(labelElement, select)

  return field
}

export function createTuneToggleField({
  label,
  value,
  onChange,
}: TuneToggleOptions): HTMLDivElement {
  const field = document.createElement('div')
  const button = document.createElement('button')
  const track = document.createElement('span')
  const thumb = document.createElement('span')
  const labelElement = document.createElement('span')
  let currentValue = value

  field.className = 'editor-block-tune-field editor-block-tune-field--toggle'
  field.contentEditable = 'false'
  button.className = 'editor-block-tune-toggle'
  button.type = 'button'
  button.setAttribute('role', 'switch')
  button.setAttribute('aria-label', label)
  track.className = 'editor-plain-field__toggle-track'
  thumb.className = 'editor-plain-field__toggle-thumb'
  labelElement.className = 'editor-block-tune-field__label'
  labelElement.textContent = label

  syncTuneToggle(button, currentValue)

  function toggleValue(): void {
    currentValue = !currentValue
    syncTuneToggle(button, currentValue)
    onChange(currentValue)
  }

  field.addEventListener(
    'click',
    (event) => {
      stopTuneEventPropagation(event)
      toggleValue()
    },
    true,
  )
  stopTuneEvents(button)

  track.append(thumb)
  button.append(track)
  field.append(labelElement, button)

  return field
}

function stopTuneEventPropagation(event: Event): void {
  event.stopImmediatePropagation()
  event.stopPropagation()
}

function stopTuneEvents(element: HTMLElement): void {
  ;[
    'pointerdown',
    'pointerup',
    'mousedown',
    'mouseup',
    'keydown',
    'keyup',
  ].forEach((eventName) => {
    element.addEventListener(eventName, stopTuneEventPropagation, true)
  })
}

function syncTuneToggle(button: HTMLButtonElement, value: boolean): void {
  button.setAttribute('aria-checked', String(value))
  button.classList.toggle('editor-block-tune-toggle--checked', value)
}
