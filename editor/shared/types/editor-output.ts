export type EditorBlockTuneData = Record<string, unknown>

export interface EditorOutputBlock<
  TType extends string = string,
  TData = unknown,
> {
  id?: string
  type: TType
  data: TData
  tunes?: EditorBlockTuneData
}

export interface EditorOutputData<
  TBlock extends EditorOutputBlock = EditorOutputBlock,
> {
  time?: number
  version?: string
  blocks: TBlock[]
}

export function isEditorOutputData(value: unknown): value is EditorOutputData {
  if (!isRecord(value)) {
    return false
  }

  return Array.isArray(value.blocks) && value.blocks.every(isEditorOutputBlock)
}

function isEditorOutputBlock(value: unknown): value is EditorOutputBlock {
  if (!isRecord(value)) {
    return false
  }

  return typeof value.type === 'string' && 'data' in value
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
