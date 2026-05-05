import type { BlockTune, BlockTuneConstructable } from '@editorjs/editorjs/types'
import {
  normalizeEmbedDisplayTuneData,
  type EmbedDisplayTuneData,
} from '~~/editor/shared'
import { getCurrentEditorMessages } from '~~/i18n/editor'
import { createTunePanel, createTuneToggleField } from './tune-ui'

interface EmbedDisplayTuneConstructorOptions {
  data: unknown
}

class EmbedDisplayTune implements BlockTune {
  static isTune = true

  private data: EmbedDisplayTuneData

  constructor({ data }: EmbedDisplayTuneConstructorOptions) {
    this.data = normalizeEmbedDisplayTuneData(data)
  }

  render(): HTMLElement {
    const messages = getCurrentEditorMessages()
    const panel = createTunePanel(messages.tunes.embedDisplay.title)

    panel.append(
      createTuneToggleField({
        label: messages.tunes.embedDisplay.label,
        value: this.data.mode === 'fancybox',
        onChange: (value) => {
          this.data.mode = value ? 'fancybox' : 'inline'
        },
      }),
    )

    return panel
  }

  save(): EmbedDisplayTuneData {
    return this.data
  }
}

export const EmbedDisplayTuneConstructable =
  EmbedDisplayTune as unknown as BlockTuneConstructable
