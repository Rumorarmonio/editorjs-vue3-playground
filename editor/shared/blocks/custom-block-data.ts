import type { ParagraphBlockData } from '~~/editor/shared/blocks/standard-block-data'
import type {
  EditorOutputBlock,
  EditorOutputData,
} from '~~/editor/shared/types/editor-output'

export const noticeBlockTypes = ['info', 'success', 'warning'] as const

export type NoticeBlockType = (typeof noticeBlockTypes)[number]

export type SectionIntroDescriptionBlock = EditorOutputBlock<
  'paragraph',
  ParagraphBlockData
>

export type SectionIntroDescriptionData =
  EditorOutputData<SectionIntroDescriptionBlock>

export interface NoticeBlockData {
  title: string
  text: string
  type: NoticeBlockType
}

export interface SectionIntroBlockData {
  title: string
  description: SectionIntroDescriptionData
}

export interface CustomBlockDataMap {
  notice: NoticeBlockData
  sectionIntro: SectionIntroBlockData
}

export function normalizeNoticeBlockData(value: unknown): NoticeBlockData {
  if (!isRecord(value)) {
    return createDefaultNoticeBlockData()
  }

  return {
    title: typeof value.title === 'string' ? value.title : '',
    text: typeof value.text === 'string' ? value.text : '',
    type: isNoticeBlockType(value.type) ? value.type : 'info',
  }
}

export function isNoticeBlockData(value: unknown): value is NoticeBlockData {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.title === 'string' &&
    typeof value.text === 'string' &&
    isNoticeBlockType(value.type)
  )
}

export function normalizeSectionIntroBlockData(
  value: unknown,
): SectionIntroBlockData {
  if (!isRecord(value)) {
    return createDefaultSectionIntroBlockData()
  }

  return {
    title: typeof value.title === 'string' ? value.title : '',
    description: normalizeSectionIntroDescriptionData(value.description),
  }
}

export function normalizeSectionIntroDescriptionData(
  value: unknown,
): SectionIntroDescriptionData {
  if (!isSectionIntroDescriptionData(value)) {
    return createDefaultSectionIntroDescriptionData()
  }

  return value
}

export function isSectionIntroBlockData(
  value: unknown,
): value is SectionIntroBlockData {
  return (
    isRecord(value) &&
    typeof value.title === 'string' &&
    isSectionIntroDescriptionData(value.description)
  )
}

export function isSectionIntroDescriptionData(
  value: unknown,
): value is SectionIntroDescriptionData {
  return (
    isRecord(value) &&
    (value.time === undefined || typeof value.time === 'number') &&
    (value.version === undefined || typeof value.version === 'string') &&
    Array.isArray(value.blocks) &&
    value.blocks.every(isSectionIntroDescriptionBlock)
  )
}

function createDefaultNoticeBlockData(): NoticeBlockData {
  return {
    title: '',
    text: '',
    type: 'info',
  }
}

function createDefaultSectionIntroBlockData(): SectionIntroBlockData {
  return {
    title: '',
    description: createDefaultSectionIntroDescriptionData(),
  }
}

function createDefaultSectionIntroDescriptionData(): SectionIntroDescriptionData {
  return {
    blocks: [],
  }
}

function isNoticeBlockType(value: unknown): value is NoticeBlockType {
  return noticeBlockTypes.includes(value as NoticeBlockType)
}

function isSectionIntroDescriptionBlock(
  value: unknown,
): value is SectionIntroDescriptionBlock {
  return (
    isRecord(value) &&
    (value.id === undefined || typeof value.id === 'string') &&
    value.type === 'paragraph' &&
    isRecord(value.data) &&
    typeof value.data.text === 'string' &&
    (value.tunes === undefined || isRecord(value.tunes))
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
