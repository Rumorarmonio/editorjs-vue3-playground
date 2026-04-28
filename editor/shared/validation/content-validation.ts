import {
  normalizeMediaGalleryBlockData,
  normalizeNoticeBlockData,
  normalizeSectionIntroBlockData,
  normalizeTwoColumnsBlockData,
  type MediaGalleryBlockData,
  type MediaGalleryItemData,
  type NoticeBlockData,
  type RichParagraphFieldData,
  type SectionIntroBlockData,
  type TwoColumnsBlockData,
  type TwoColumnsContentData,
} from '~~/editor/shared/blocks/custom-block-data'
import type { ListBlockItem } from '~~/editor/shared/blocks/standard-block-data'
import type { EditorContentData } from '~~/editor/shared/types/content'

export interface ValidationIssue {
  path: string
  message: string
}

export interface ValidationResult {
  valid: boolean
  issues: ValidationIssue[]
}

const maxNoticeTitleLength = 120
const maxNoticeTextLength = 500
const maxSectionIntroTitleLength = 120
const maxGalleryIdLength = 80
const maxMediaAltLength = 160
const maxMediaCaptionLength = 300
const galleryIdPattern = /^[a-z0-9_-]+$/i

export function validateEditorContentData(
  content: EditorContentData,
): ValidationResult {
  const issues = content.blocks.flatMap((block, index) => {
    const blockPath = `blocks.${index}`

    switch (block.type) {
      case 'notice':
        return prefixValidationIssues(
          validateNoticeBlockData(block.data).issues,
          blockPath,
        )
      case 'sectionIntro':
        return prefixValidationIssues(
          validateSectionIntroBlockData(block.data).issues,
          blockPath,
        )
      case 'twoColumns':
        return prefixValidationIssues(
          validateTwoColumnsBlockData(block.data).issues,
          blockPath,
        )
      case 'mediaGallery':
        return prefixValidationIssues(
          validateMediaGalleryBlockData(block.data).issues,
          blockPath,
        )
      default:
        return []
    }
  })

  return createValidationResult(issues)
}

export function validateNoticeBlockData(
  value: Partial<NoticeBlockData>,
): ValidationResult {
  const data = normalizeNoticeBlockData(value)
  const issues: ValidationIssue[] = []

  if (!hasText(data.title) && !hasText(data.text)) {
    issues.push({
      path: 'title',
      message: 'Add a title or text.',
    })
    issues.push({
      path: 'text',
      message: 'Add a title or text.',
    })
  }

  pushMaxLengthIssue(issues, 'title', data.title, maxNoticeTitleLength, 'Title')
  pushMaxLengthIssue(issues, 'text', data.text, maxNoticeTextLength, 'Text')

  return createValidationResult(issues)
}

export function validateSectionIntroBlockData(
  value: Partial<SectionIntroBlockData>,
): ValidationResult {
  const data = normalizeSectionIntroBlockData(value)
  const issues: ValidationIssue[] = []

  if (!hasText(data.title) && !hasRichParagraphContent(data.description)) {
    issues.push({
      path: 'title',
      message: 'Add a title or description.',
    })
    issues.push({
      path: 'description',
      message: 'Add a title or description.',
    })
  }

  pushMaxLengthIssue(
    issues,
    'title',
    data.title,
    maxSectionIntroTitleLength,
    'Title',
  )

  return createValidationResult(issues)
}

export function validateTwoColumnsBlockData(
  value: Partial<TwoColumnsBlockData>,
): ValidationResult {
  const data = normalizeTwoColumnsBlockData(value)
  const issues: ValidationIssue[] = []

  if (!hasTwoColumnsContent(data.left) && !hasTwoColumnsContent(data.right)) {
    issues.push({
      path: 'left',
      message: 'Add content to at least one column.',
    })
    issues.push({
      path: 'right',
      message: 'Add content to at least one column.',
    })
  }

  return createValidationResult(issues)
}

export function validateMediaGalleryBlockData(
  value: Partial<MediaGalleryBlockData>,
): ValidationResult {
  const data = normalizeMediaGalleryBlockData(value)
  const issues: ValidationIssue[] = []

  if (hasText(data.galleryId)) {
    pushMaxLengthIssue(
      issues,
      'galleryId',
      data.galleryId,
      maxGalleryIdLength,
      'Gallery ID',
    )

    if (!galleryIdPattern.test(data.galleryId)) {
      issues.push({
        path: 'galleryId',
        message: 'Use only letters, numbers, dashes, and underscores.',
      })
    }
  }

  if (data.items.length === 0) {
    issues.push({
      path: 'items',
      message: 'Add at least one media card.',
    })
  }

  data.items.forEach((item, index) => {
    issues.push(...validateMediaGalleryItem(item, index))
  })

  return createValidationResult(issues)
}

export function findValidationMessage(
  result: ValidationResult,
  path: string,
): string | undefined {
  return result.issues.find((issue) => issue.path === path)?.message
}

export function getValidationSummary(result: ValidationResult): string | null {
  if (result.valid) {
    return null
  }

  if (result.issues.length === 1) {
    return result.issues[0]?.message ?? 'Content has validation errors.'
  }

  return `Content has ${result.issues.length} validation errors.`
}

function validateMediaGalleryItem(
  item: MediaGalleryItemData,
  index: number,
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const basePath = `items.${index}`

  if (!hasText(item.url)) {
    issues.push({
      path: `${basePath}.url`,
      message: 'Media URL is required.',
    })
  } else if (!isAllowedMediaUrl(item.url)) {
    issues.push({
      path: `${basePath}.url`,
      message: 'Use a valid http, relative, blob, image data, or video data URL.',
    })
  }

  if (item.type === 'image' && !hasText(item.alt)) {
    issues.push({
      path: `${basePath}.alt`,
      message: 'Alt text is required for images.',
    })
  }

  pushMaxLengthIssue(
    issues,
    `${basePath}.alt`,
    item.alt,
    maxMediaAltLength,
    'Alt text',
  )
  pushMaxLengthIssue(
    issues,
    `${basePath}.caption`,
    item.caption,
    maxMediaCaptionLength,
    'Caption',
  )

  return issues
}

function createValidationResult(issues: ValidationIssue[]): ValidationResult {
  return {
    valid: issues.length === 0,
    issues,
  }
}

function prefixValidationIssues(
  issues: ValidationIssue[],
  prefix: string,
): ValidationIssue[] {
  return issues.map((issue) => {
    return {
      ...issue,
      path: `${prefix}.${issue.path}`,
    }
  })
}

function pushMaxLengthIssue(
  issues: ValidationIssue[],
  path: string,
  value: string,
  maxLength: number,
  label: string,
): void {
  if (value.length <= maxLength) {
    return
  }

  issues.push({
    path,
    message: `${label} must be ${maxLength} characters or fewer.`,
  })
}

function hasText(value: string): boolean {
  return value.trim().length > 0
}

function hasRichParagraphContent(data: RichParagraphFieldData): boolean {
  return data.blocks.some((block) => hasText(block.data.text))
}

function hasTwoColumnsContent(data: TwoColumnsContentData): boolean {
  return data.blocks.some((block) => {
    switch (block.type) {
      case 'paragraph':
      case 'header':
        return hasText(block.data.text)
      case 'list':
        return block.data.items.some(hasListItemContent)
      default:
        return false
    }
  })
}

function hasListItemContent(item: ListBlockItem): boolean {
  return hasText(item.content) || item.items.some(hasListItemContent)
}

function isAllowedMediaUrl(url: string): boolean {
  return (
    url.startsWith('https://') ||
    url.startsWith('http://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:image/svg+xml') ||
    url.startsWith('data:image/') ||
    url.startsWith('data:video/') ||
    (url.startsWith('/') && !url.startsWith('//')) ||
    url.startsWith('./') ||
    url.startsWith('../')
  )
}
