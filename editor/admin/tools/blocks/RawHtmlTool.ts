import type {
  BlockAPI,
  BlockTool,
  BlockToolConstructorOptions,
  ToolConstructable,
  ToolboxConfig,
} from '@editorjs/editorjs/types'
import {
  createPlainTextareaField,
  type PlainFieldControl,
} from '~~/editor/admin/fields'
import {
  normalizeRawHtmlBlockData,
  validateRawHtmlBlockData,
  type RawHtmlBlockData,
} from '~~/editor/shared'
import { getCurrentEditorMessages } from '~~/i18n/editor'

export default class RawHtmlTool implements BlockTool {
  static isReadOnlySupported = true

  private readonly block: BlockAPI
  private readonly readOnly: boolean
  private data: RawHtmlBlockData
  private htmlField: PlainFieldControl<string, HTMLTextAreaElement> | null = null
  private captionField: PlainFieldControl<
    string,
    HTMLTextAreaElement
  > | null = null

  static get toolbox(): ToolboxConfig {
    const messages = getCurrentEditorMessages()

    return {
      title: messages.tools.rawHtml.toolboxTitle,
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M6.4 5.1 2.5 9l3.9 3.9 1.1-1.1L4.7 9l2.8-2.8-1.1-1.1Zm5.2 0-1.1 1.1L13.3 9l-2.8 2.8 1.1 1.1L15.5 9l-3.9-3.9ZM9.3 4 7.2 14l1.5.3L10.8 4.3 9.3 4Z"/></svg>',
    }
  }

  constructor(
    options: BlockToolConstructorOptions<Partial<RawHtmlBlockData>>,
  ) {
    this.block = options.block
    this.readOnly = options.readOnly
    this.data = normalizeRawHtmlBlockData(options.data)
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div')
    const messages = getCurrentEditorMessages()

    wrapper.className = 'editor-raw-html-tool'

    this.htmlField = createPlainTextareaField({
      name: 'raw-html-html',
      label: messages.tools.rawHtml.htmlLabel,
      value: this.data.html,
      placeholder: messages.tools.rawHtml.htmlPlaceholder,
      hint: messages.tools.rawHtml.securityHint,
      rows: 12,
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.html = value
        this.htmlField?.setError(undefined)
        this.dispatchChange()
      },
    })
    this.htmlField.control.classList.add('editor-raw-html-tool__html-control')
    this.htmlField.control.spellcheck = false

    this.captionField = createPlainTextareaField({
      name: 'raw-html-caption',
      label: messages.tools.rawHtml.captionLabel,
      value: this.data.caption,
      placeholder: messages.tools.rawHtml.captionPlaceholder,
      rows: 2,
      readOnly: this.readOnly,
      onChange: (value) => {
        this.data.caption = value
        this.captionField?.setError(undefined)
        this.dispatchChange()
      },
    })

    wrapper.append(this.htmlField.root, this.captionField.root)

    return wrapper
  }

  save(): RawHtmlBlockData {
    const data = this.getCurrentData()

    this.syncValidationErrors(data)

    return data
  }

  validate(data: Partial<RawHtmlBlockData>): boolean {
    this.syncValidationErrors(normalizeRawHtmlBlockData(data))

    return true
  }

  private getCurrentData(): RawHtmlBlockData {
    return normalizeRawHtmlBlockData({
      html: this.htmlField?.getValue() ?? this.data.html,
      caption: this.captionField?.getValue() ?? this.data.caption,
    })
  }

  private syncValidationErrors(data: RawHtmlBlockData): boolean {
    const result = validateRawHtmlBlockData(data)

    this.htmlField?.setError(
      result.issues.find((issue) => issue.path === 'html')?.message,
    )
    this.captionField?.setError(
      result.issues.find((issue) => issue.path === 'caption')?.message,
    )

    return result.valid
  }

  private dispatchChange(): void {
    this.block.dispatchChange()
  }
}

export const RawHtmlToolConstructable =
  RawHtmlTool as unknown as ToolConstructable
