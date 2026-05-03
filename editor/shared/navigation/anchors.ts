import { getKnownBlockTuneData } from '~~/editor/shared/tunes/block-tunes'
import type { EditorContentBlock } from '~~/editor/shared/registry/block-registry'

const slugFallback = 'section'

export function getBlockAnchorId(
  blocks: EditorContentBlock[],
  block: EditorContentBlock,
  index: number,
): string | undefined {
  const anchor = getKnownBlockTuneData(block.tunes).anchor?.anchor

  if (!anchor) {
    return undefined
  }

  const sameAnchorIndex = blocks
    .slice(0, index)
    .filter((currentBlock) => {
      return getKnownBlockTuneData(currentBlock.tunes).anchor?.anchor === anchor
    }).length

  return sameAnchorIndex === 0 ? anchor : `${anchor}-${sameAnchorIndex + 1}`
}

export function getBlockRenderedAnchorId(
  blocks: EditorContentBlock[],
  block: EditorContentBlock,
  index: number,
): string | undefined {
  const anchor = getRenderedAnchorCandidate(block)

  if (!anchor) {
    return undefined
  }

  const sameAnchorIndex = blocks
    .slice(0, index)
    .filter((currentBlock) => getRenderedAnchorCandidate(currentBlock) === anchor)
    .length

  return sameAnchorIndex === 0 ? anchor : `${anchor}-${sameAnchorIndex + 1}`
}

export function getHeaderAnchorId(
  blocks: EditorContentBlock[],
  block: EditorContentBlock,
  index: number,
): string | undefined {
  if (block.type !== 'header') {
    return undefined
  }

  return getBlockRenderedAnchorId(blocks, block, index)
}

function getRenderedAnchorCandidate(
  block: EditorContentBlock,
): string | undefined {
  const explicitAnchor = getKnownBlockTuneData(block.tunes).anchor?.anchor

  if (explicitAnchor) {
    return explicitAnchor
  }

  if (block.type === 'header') {
    return slugifyInlineText(block.data.text)
  }

  return undefined
}

function slugifyInlineText(value: string): string {
  const text = value
    .replaceAll(/<[^>]*>/g, ' ')
    .replaceAll(/&nbsp;/gi, ' ')
    .replaceAll(/&amp;/gi, 'and')
    .replaceAll(/&[^;]+;/g, ' ')
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9а-яё]+/gi, '-')
    .replaceAll(/^-+|-+$/g, '')

  return text || slugFallback
}
