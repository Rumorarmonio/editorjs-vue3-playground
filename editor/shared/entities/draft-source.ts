import { EDITOR_DRAFT_STORAGE_KEY } from '~~/editor/shared/constants/draft-storage'
import { editorBlockRegistry } from '~~/editor/shared/registry/block-registry'
import { isEditorOutputData } from '~~/editor/shared/types/editor-output'
import type {
  EditorContentData,
  ResolvedEditorContent,
} from '~~/editor/shared/types/content'
import type { EditorOutputData } from '~~/editor/shared/types/editor-output'

export interface DraftStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export function resolveEditorContent(
  defaultContent: EditorContentData,
  storage?: DraftStorage | null,
): ResolvedEditorContent {
  const draft = readEditorDraft(storage)

  if (draft) {
    return {
      source: 'draft',
      data: draft,
    }
  }

  return {
    source: 'default',
    data: defaultContent,
  }
}

export function readEditorDraft(
  storage?: DraftStorage | null,
): EditorContentData | null {
  const serializedDraft = storage?.getItem(EDITOR_DRAFT_STORAGE_KEY)

  if (!serializedDraft) {
    return null
  }

  try {
    const parsedDraft: unknown = JSON.parse(serializedDraft)

    return isKnownEditorContentData(parsedDraft) ? parsedDraft : null
  } catch {
    return null
  }
}

export function writeEditorDraft(
  storage: DraftStorage,
  draft: EditorContentData,
): void {
  storage.setItem(EDITOR_DRAFT_STORAGE_KEY, JSON.stringify(draft))
}

export function clearEditorDraft(storage: DraftStorage): void {
  storage.removeItem(EDITOR_DRAFT_STORAGE_KEY)
}

function isKnownEditorContentData(
  value: unknown,
): value is EditorContentData {
  if (!isEditorOutputData(value)) {
    return false
  }

  return value.blocks.every(isKnownEditorContentBlock)
}

function isKnownEditorContentBlock(
  block: EditorOutputData['blocks'][number],
): boolean {
  return block.type in editorBlockRegistry
}
