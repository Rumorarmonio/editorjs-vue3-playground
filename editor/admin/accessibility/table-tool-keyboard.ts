import type { EditorUiMessages } from '~~/i18n'

const patchedAttribute = 'data-editor-table-keyboard-patched'

interface TableKeyboardLabels {
  addColumn: string
  addRow: string
  columnMenu: string
  rowMenu: string
}

export interface TableToolKeyboardPatch {
  destroy: () => void
}

export function enableTableToolKeyboardAccess({
  root,
  messages,
}: {
  root: HTMLElement
  messages: EditorUiMessages
}): TableToolKeyboardPatch {
  const labels = getTableKeyboardLabels(messages)
  const observer = new MutationObserver(() => {
    patchTableControls(root, labels)
  })

  patchTableControls(root, labels)
  observer.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  })

  return {
    destroy() {
      observer.disconnect()
    },
  }
}

function patchTableControls(root: HTMLElement, labels: TableKeyboardLabels): void {
  root.querySelectorAll<HTMLElement>('.tc-add-column').forEach((control) => {
    patchButtonControl(control, labels.addColumn)
    syncDisabledControlTabIndex(control, 'tc-add-column--disabled')
  })

  root.querySelectorAll<HTMLElement>('.tc-add-row').forEach((control) => {
    patchButtonControl(control, labels.addRow)
    syncDisabledControlTabIndex(control, 'tc-add-row--disabled')
  })

  root.querySelectorAll<HTMLElement>('.tc-toolbox__toggler').forEach((control) => {
    const toolbox = control.closest('.tc-toolbox')
    const label = toolbox?.classList.contains('tc-toolbox--column')
      ? labels.columnMenu
      : labels.rowMenu

    patchButtonControl(control, label)
  })

  root.querySelectorAll<HTMLElement>('.tc-popover__item').forEach((control) => {
    const label =
      control.querySelector<HTMLElement>('.tc-popover__item-label')?.textContent
        ?.trim() || control.textContent?.trim()

    patchButtonControl(control, label)
    control.tabIndex = control.classList.contains('tc-popover__item--hidden')
      ? -1
      : 0
  })
}

function patchButtonControl(control: HTMLElement, label?: string): void {
  control.contentEditable = 'false'
  control.tabIndex = 0
  control.setAttribute('role', 'button')

  if (label) {
    control.setAttribute('aria-label', label)
  }

  if (control.getAttribute(patchedAttribute) === 'true') {
    return
  }

  control.setAttribute(patchedAttribute, 'true')
  control.addEventListener('keydown', handleButtonKeydown)
}

function syncDisabledControlTabIndex(
  control: HTMLElement,
  disabledClassName: string,
): void {
  control.tabIndex = control.classList.contains(disabledClassName) ? -1 : 0
}

function handleButtonKeydown(event: KeyboardEvent): void {
  event.stopPropagation()

  if (event.key !== 'Enter' && event.key !== ' ') {
    return
  }

  event.preventDefault()
  const control = event.currentTarget

  if (control instanceof HTMLElement) {
    control.click()
  }
}

function getTableKeyboardLabels(messages: EditorUiMessages): TableKeyboardLabels {
  return messages.tools.tableControls
}
