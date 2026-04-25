import type { EditorOutputBlock } from '~~/editor/shared/types/editor-output'

export interface EditorBlockDefinition<TType extends string = string> {
  type: TType
  title: string
  isDefault?: boolean
}

export type EditorBlockRegistry<TType extends string = string> = {
  readonly [Type in TType]: EditorBlockDefinition<Type>
}

export type EditorBlockFromDataMap<
  TDataMap extends object,
  TType extends keyof TDataMap & string = keyof TDataMap & string,
> = {
  [Type in TType]: EditorOutputBlock<Type, TDataMap[Type]>
}[TType]

export type EditorBlockFromDataMapByType<
  TDataMap extends object,
  TType extends keyof TDataMap & string,
> = EditorOutputBlock<TType, TDataMap[TType]>
