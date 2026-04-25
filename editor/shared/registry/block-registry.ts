import type { StandardBlockDataMap } from '~~/editor/shared/blocks/standard-block-data'
import type {
  EditorBlockFromDataMapByType,
  EditorBlockFromDataMap,
  EditorBlockRegistry,
} from '~~/editor/shared/registry/types'

export const editorBlockRegistry = {
  paragraph: {
    type: 'paragraph',
    title: 'Paragraph',
    isDefault: true,
  },
  header: {
    type: 'header',
    title: 'Header',
  },
  list: {
    type: 'list',
    title: 'List',
  },
  quote: {
    type: 'quote',
    title: 'Quote',
  },
  delimiter: {
    type: 'delimiter',
    title: 'Delimiter',
  },
  table: {
    type: 'table',
    title: 'Table',
  },
  embed: {
    type: 'embed',
    title: 'Embed',
  },
  image: {
    type: 'image',
    title: 'Image',
  },
} as const satisfies EditorBlockRegistry<keyof StandardBlockDataMap & string>

export type EditorBlockType = keyof typeof editorBlockRegistry

export type EditorBlockDataMap = StandardBlockDataMap

export type EditorBlock<
  TType extends EditorBlockType = EditorBlockType,
> = EditorBlockFromDataMapByType<EditorBlockDataMap, TType>

export type EditorContentBlock = EditorBlockFromDataMap<EditorBlockDataMap>
