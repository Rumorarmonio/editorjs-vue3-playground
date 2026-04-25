import type { EditorContentBlock } from '~~/editor/shared/registry/block-registry'
import type { EditorContentData } from '~~/editor/shared/types/content'

export const DEFAULT_EDITOR_DATA_VERSION = '2.0.0'

export function createEditorContentData(
  blocks: EditorContentBlock[],
  time = Date.now(),
): EditorContentData {
  return {
    time,
    blocks,
    version: DEFAULT_EDITOR_DATA_VERSION,
  }
}
