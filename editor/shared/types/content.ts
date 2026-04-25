import type { EditorOutputData } from './editor-output'
import type { EditorContentBlock } from '~~/editor/shared/registry/block-registry'

export type EditorContentData = EditorOutputData<EditorContentBlock>

export type EditorContentSource = 'default' | 'draft'

export interface ResolvedEditorContent {
  source: EditorContentSource
  data: EditorContentData
}
