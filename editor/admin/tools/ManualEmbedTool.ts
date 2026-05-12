import Embed from '@editorjs/embed'
import type {
  BlockTool,
  BlockToolConstructorOptions,
  ToolConstructable,
  ToolboxConfig,
} from '@editorjs/editorjs/types'
import {
  createEmbedDataFromSource,
  getAllowedEmbedIframeUrl,
  getEmbedServiceLabel,
  supportedEmbedServiceLabels,
  type EmbedBlockData,
} from '~~/editor/shared'
import { getCurrentEditorMessages } from '~~/i18n/editor'

type PartialEmbedBlockData = Partial<EmbedBlockData>

interface EmbedToolInstance extends BlockTool {
  data: PartialEmbedBlockData
}

interface EmbedToolConstructor {
  new (
    options: BlockToolConstructorOptions<PartialEmbedBlockData>,
  ): EmbedToolInstance
}

const BaseEmbedTool = Embed as unknown as EmbedToolConstructor

export default class ManualEmbedTool extends BaseEmbedTool {
  private readonly isReadOnlyMode: boolean
  private element: HTMLElement | null = null
  private captionElement: HTMLElement | null = null
  private manualData: PartialEmbedBlockData
  private captionHtml: string

  static get toolbox(): ToolboxConfig {
    const messages = getCurrentEditorMessages()

    return {
      title: messages.tools.embed.toolboxTitle,
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M3 4.5h12a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 15 13.5H3A1.5 1.5 0 0 1 1.5 12V6A1.5 1.5 0 0 1 3 4.5Zm0 1.5v6h12V6H3Zm5 1.25 3 1.75-3 1.75v-3.5Z"/></svg>',
    }
  }

  constructor(options: BlockToolConstructorOptions<PartialEmbedBlockData>) {
    super(options)
    this.isReadOnlyMode = options.readOnly
    this.manualData = { ...options.data }
    this.captionHtml = options.data.caption ?? ''
  }

  override render(): HTMLElement {
    if (isCompleteEmbedData(this.manualData)) {
      const iframeUrl = getAllowedEmbedIframeUrl(this.manualData)

      if (iframeUrl) {
        return this.renderManualEmbedPreview(this.manualData, iframeUrl)
      }

      const element = super.render() as HTMLElement

      this.setCurrentElement(element)

      return element
    }

    return this.renderManualInput()
  }

  override save(): PartialEmbedBlockData {
    return {
      ...this.manualData,
      caption: this.getCurrentCaptionHtml(),
    }
  }

  override validate(data: PartialEmbedBlockData): boolean {
    return Boolean(data.service && data.source && data.embed)
  }

  private renderManualInput(options: { isEditMode?: boolean } = {}): HTMLElement {
    const wrapper = document.createElement('div')
    const input = document.createElement('input')
    const hint = document.createElement('p')
    const error = document.createElement('p')
    const messages = getCurrentEditorMessages()
    const isEditMode = Boolean(options.isEditMode)

    wrapper.classList.add('editor-embed-input')
    input.classList.add('editor-embed-input__field')
    input.type = 'url'
    input.value = isEditMode ? this.manualData.source ?? '' : ''
    input.placeholder = messages.tools.embed.urlPlaceholder(
      supportedEmbedServiceLabels,
    )
    input.disabled = this.isReadOnlyMode
    hint.classList.add('editor-embed-input__hint')
    hint.textContent = messages.tools.embed.hint
    error.classList.add('editor-embed-input__error')
    error.setAttribute('aria-live', 'polite')
    prepareInteractiveElement(input)

    input.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') {
        return
      }

      event.preventDefault()
      this.applyEmbedUrl(input.value, error)
    })

    if (!isEditMode) {
      input.addEventListener('paste', () => {
        window.setTimeout(() => {
          this.applyEmbedUrl(input.value, error)
        })
      })
    }

    wrapper.append(input, hint, error)

    if (isEditMode) {
      const actions = document.createElement('div')
      const applyButton = document.createElement('button')
      const cancelButton = document.createElement('button')

      actions.classList.add('editor-embed-input__actions')
      applyButton.classList.add('editor-embed-input__button')
      applyButton.type = 'button'
      applyButton.textContent = messages.tools.embed.applyUrlButton
      applyButton.disabled = this.isReadOnlyMode
      prepareInteractiveElement(applyButton)
      cancelButton.classList.add('editor-embed-input__button')
      cancelButton.type = 'button'
      cancelButton.textContent = messages.tools.embed.cancelEditButton
      prepareInteractiveElement(cancelButton)

      applyButton.addEventListener('click', () => {
        this.applyEmbedUrl(input.value, error)
      })

      cancelButton.addEventListener('click', () => {
        this.renderCurrentBlock()
      })

      actions.append(applyButton, cancelButton)
      wrapper.append(actions)
    }

    this.setCurrentElement(wrapper)

    return wrapper
  }

  private renderManualEmbedPreview(
    data: EmbedBlockData,
    iframeUrl: string,
  ): HTMLElement {
    const wrapper = document.createElement('figure')
    const actions = document.createElement('div')
    const editButton = document.createElement('button')
    const iframe = document.createElement('iframe')
    const caption = document.createElement('figcaption')
    const messages = getCurrentEditorMessages()

    wrapper.classList.add('editor-embed-preview')
    actions.classList.add('editor-embed-preview__actions')
    editButton.classList.add('editor-embed-preview__button')
    editButton.type = 'button'
    editButton.textContent = messages.tools.embed.editUrlButton
    editButton.hidden = this.isReadOnlyMode
    prepareInteractiveElement(editButton)
    iframe.classList.add('editor-embed-preview__iframe')
    iframe.src = iframeUrl
    iframe.height = String(data.height ?? 320)
    iframe.tabIndex = -1
    iframe.title = data.caption || getEmbedServiceLabel(data.service)
    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    iframe.allowFullscreen = true
    iframe.loading = 'lazy'
    iframe.referrerPolicy = 'strict-origin-when-cross-origin'

    caption.classList.add('editor-embed-preview__caption')
    caption.contentEditable = String(!this.isReadOnlyMode)
    caption.tabIndex = this.isReadOnlyMode ? -1 : 0
    caption.dataset.placeholder = getCurrentEditorMessages().tools.embed.captionPlaceholder
    caption.innerHTML = this.getCurrentCaptionHtml()
    this.captionElement = caption

    caption.addEventListener('input', () => {
      this.syncCaptionData()
    })

    wrapper.append(iframe, caption)

    if (!this.isReadOnlyMode) {
      caption.addEventListener(
        'keydown',
        (event) => {
          if (event.key !== 'Tab' || event.shiftKey) {
            return
          }

          event.preventDefault()
          event.stopPropagation()
          editButton.focus()
        },
        { capture: true },
      )

      editButton.addEventListener('click', () => {
        this.renderInputFormForCurrentBlock()
      })

      actions.append(editButton)
      wrapper.append(actions)
    }

    this.setCurrentElement(wrapper)

    return wrapper
  }

  private applyEmbedUrl(value: string, error: HTMLElement): void {
    const embedData = createEmbedDataFromSource(value)

    if (!embedData) {
      error.textContent = value.trim()
        ? getCurrentEditorMessages().tools.embed.supportedServices(
            supportedEmbedServiceLabels,
          )
        : ''
      return
    }

    error.textContent = ''
    const caption = this.getCurrentCaptionHtml()
    this.captionHtml = caption
    this.manualData = {
      ...embedData,
      caption,
    }
    this.data = this.manualData
    this.renderCurrentBlock()
  }

  private renderInputFormForCurrentBlock(): void {
    this.syncCaptionData()
    this.captionElement = null

    const previousElement = this.element
    const nextElement = this.renderManualInput({ isEditMode: true })

    previousElement?.replaceWith(nextElement)
  }

  private renderCurrentBlock(): void {
    const previousElement = this.element
    const nextElement = this.render()

    previousElement?.replaceWith(nextElement)
  }

  private setCurrentElement(element: HTMLElement): void {
    this.element = element
    ;(this as unknown as { element: HTMLElement }).element = element
  }

  private syncCaptionData(): void {
    this.captionHtml = this.getCurrentCaptionHtml()
    this.manualData = {
      ...this.manualData,
      caption: this.captionHtml,
    }
  }

  private getCurrentCaptionHtml(): string {
    return this.captionElement?.innerHTML ?? this.captionHtml
  }
}

function isCompleteEmbedData(data: PartialEmbedBlockData): data is EmbedBlockData {
  return Boolean(data.service && data.source && data.embed)
}

function prepareInteractiveElement(element: HTMLElement): void {
  element.contentEditable = 'false'
  element.tabIndex = 0
  element.addEventListener('keydown', stopKeyboardEventPropagation)
}

function stopKeyboardEventPropagation(event: KeyboardEvent): void {
  event.stopPropagation()
}

export const ManualEmbedToolConstructable =
  ManualEmbedTool as unknown as ToolConstructable
