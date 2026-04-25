export interface ParagraphBlockData {
  text: string
}

export interface HeaderBlockData {
  text: string
  level: 1 | 2 | 3 | 4 | 5 | 6
}

export interface ListBlockItem {
  content: string
  items: ListBlockItem[]
  meta?: Record<string, unknown>
}

export interface ListBlockData {
  style: 'ordered' | 'unordered' | 'checklist'
  meta?: Record<string, unknown>
  items: ListBlockItem[]
}

export interface QuoteBlockData {
  text: string
  caption?: string
  alignment?: 'left' | 'center'
}

export interface DelimiterBlockData {
  [key: string]: never
}

export interface TableBlockData {
  withHeadings?: boolean
  content: string[][]
}

export interface EmbedBlockData {
  service: string
  source: string
  embed: string
  width?: number
  height?: number
  caption?: string
}

export interface ImageBlockFileData {
  url: string
}

export interface ImageBlockData {
  file: ImageBlockFileData
  caption?: string
  alt?: string
  withBorder?: boolean
  withBackground?: boolean
  stretched?: boolean
}

export interface StandardBlockDataMap {
  paragraph: ParagraphBlockData
  header: HeaderBlockData
  list: ListBlockData
  quote: QuoteBlockData
  delimiter: DelimiterBlockData
  table: TableBlockData
  embed: EmbedBlockData
  image: ImageBlockData
}
