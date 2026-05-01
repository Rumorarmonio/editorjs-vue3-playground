import { createPlainFieldWrapper } from './field-ui'
import type { PlainFieldControl, PlainSelectFieldOptions } from './types'

export function createPlainSelectField<TValue extends string = string>(
  options: PlainSelectFieldOptions<TValue>,
): PlainFieldControl<TValue, HTMLSelectElement> {
  let currentValue = options.value
  let isReadOnly = Boolean(options.readOnly)
  const select = document.createElement('select')

  select.className = 'editor-plain-field__control'
  select.name = options.name
  select.tabIndex = 0

  options.options.forEach((option) => {
    const optionElement = document.createElement('option')

    optionElement.value = option.value
    optionElement.textContent = option.label
    optionElement.disabled = Boolean(option.disabled)
    select.append(optionElement)
  })

  select.value = currentValue

  select.addEventListener('change', () => {
    if (isReadOnly) {
      select.value = currentValue
      return
    }

    currentValue = select.value as TValue
    options.onChange(currentValue)
  })

  select.addEventListener('pointerdown', (event) => {
    if (!isReadOnly) {
      return
    }

    event.preventDefault()
  })

  select.addEventListener('keydown', (event) => {
    if (!isReadOnly || event.key === 'Tab') {
      return
    }

    event.preventDefault()
  })

  const wrapper = createPlainFieldWrapper({
    ...options,
    control: select,
  })

  return {
    root: wrapper.root,
    control: select,
    getValue: () => currentValue,
    setValue(value) {
      currentValue = value
      select.value = value
    },
    setError: wrapper.setError,
    setDisabled: wrapper.setDisabled,
    setReadOnly(readOnly) {
      isReadOnly = readOnly
      wrapper.setReadOnly(readOnly)
    },
  }
}
