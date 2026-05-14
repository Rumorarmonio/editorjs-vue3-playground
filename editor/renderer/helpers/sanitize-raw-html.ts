const allowedTags = new Set([
  'A',
  'ARTICLE',
  'ASIDE',
  'B',
  'BLOCKQUOTE',
  'BR',
  'CODE',
  'DIV',
  'EM',
  'FIGCAPTION',
  'FIGURE',
  'H2',
  'H3',
  'H4',
  'HR',
  'I',
  'LI',
  'OL',
  'P',
  'PRE',
  'SECTION',
  'SPAN',
  'STRONG',
  'TABLE',
  'TBODY',
  'TD',
  'TH',
  'THEAD',
  'TR',
  'UL',
])

const allowedGlobalAttributes = new Set(['aria-label', 'title'])

export type RawHtmlRenderMode = 'safe' | 'unsafe'

export const rawHtmlRenderMode: RawHtmlRenderMode = 'unsafe'

export function renderRawHtml(
  container: HTMLElement,
  html: string,
  baseURL = '/',
): void {
  if (rawHtmlRenderMode === 'unsafe') {
    renderUnsafeRawHtml(container, html)
    return
  }

  cleanupRawHtml(container)
  container.innerHTML = sanitizeRawHtml(html, baseURL)
}

export function cleanupRawHtml(container: HTMLElement): void {
  container.dispatchEvent(
    new CustomEvent('editor:raw-html-cleanup', {
      bubbles: false,
      detail: {
        container,
      },
    }),
  )
  container.replaceChildren()
}

export function sanitizeRawHtml(html: string, baseURL = '/'): string {
  if (!import.meta.client) {
    return escapeHtml(html)
  }

  const template = document.createElement('template')

  template.innerHTML = html
  sanitizeNode(template.content, baseURL)

  return template.innerHTML
}

function renderUnsafeRawHtml(container: HTMLElement, html: string): void {
  cleanupRawHtml(container)
  container.innerHTML = html

  executeScripts(container)
}

function executeScripts(container: HTMLElement): void {
  const scripts = Array.from(container.querySelectorAll('script'))

  scripts.forEach((script) => {
    const executableScript = document.createElement('script')

    Array.from(script.attributes).forEach((attribute) => {
      executableScript.setAttribute(attribute.name, attribute.value)
    })

    executableScript.textContent = script.textContent
    script.replaceWith(executableScript)
  })
}

function sanitizeNode(node: Node, baseURL: string): void {
  Array.from(node.childNodes).forEach((childNode) => {
    if (childNode.nodeType === Node.TEXT_NODE) {
      return
    }

    if (!(childNode instanceof HTMLElement)) {
      childNode.remove()
      return
    }

    if (!allowedTags.has(childNode.tagName)) {
      childNode.remove()
      return
    }

    sanitizeElement(childNode, baseURL)
    sanitizeNode(childNode, baseURL)
  })
}

function sanitizeElement(element: HTMLElement, baseURL: string): void {
  const href = element.getAttribute('href') ?? ''
  const target = element.getAttribute('target') ?? ''
  const attributes = Array.from(element.attributes)

  attributes.forEach((attribute) => {
    element.removeAttribute(attribute.name)
  })

  allowedGlobalAttributes.forEach((attributeName) => {
    const attribute = attributes.find((item) => item.name === attributeName)

    if (attribute) {
      element.setAttribute(attributeName, attribute.value)
    }
  })

  if (element.tagName === 'A' && isAllowedHref(href)) {
    element.setAttribute('href', resolveHref(href, baseURL))

    if (target === '_blank') {
      element.setAttribute('target', '_blank')
    }

    element.setAttribute('rel', 'noreferrer')
  }
}

function resolveHref(href: string, baseURL: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) {
    return href
  }

  const normalizedBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL

  return `${normalizedBaseURL}${href}`
}

function isAllowedHref(href: string): boolean {
  return (
    href.startsWith('https://') ||
    href.startsWith('http://') ||
    href.startsWith('mailto:') ||
    (href.startsWith('/') && !href.startsWith('//')) ||
    href.startsWith('#')
  )
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
