export function createBlockToolLabel(title: string): HTMLSpanElement {
  const label = document.createElement('span')

  label.className = 'editor-block-tool-label'
  label.textContent = title

  return label
}
