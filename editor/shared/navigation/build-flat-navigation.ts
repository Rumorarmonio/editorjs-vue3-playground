import { getKnownBlockTuneData } from '~~/editor/shared/tunes/block-tunes'
import { getBlockAnchorId, getBlockRenderedAnchorId } from './anchors'
import type { EditorContentData } from '~~/editor/shared/types/content'
import type { NavigationItem } from './types'

export function buildFlatNavigationItems(
  content: EditorContentData,
): NavigationItem[] {
  return content.blocks.flatMap((block, index) => {
    const tunes = getKnownBlockTuneData(block.tunes)
    const title = tunes.label?.label
    const explicitAnchor = getBlockAnchorId(content.blocks, block, index)
    const anchor = getBlockRenderedAnchorId(content.blocks, block, index)

    if (!title || !anchor || !explicitAnchor) {
      return []
    }

    return [
      {
        id: `${anchor}-${index}`,
        title,
        level: 1,
        anchor,
        blockId: block.id,
      },
    ]
  })
}

export function buildHeadingNavigationItems(
  content: EditorContentData,
): NavigationItem[] {
  const rootItems: NavigationItem[] = []
  const stack: NavigationItem[] = []

  content.blocks.forEach((block, index) => {
    if (block.type !== 'header') {
      return
    }

    const anchor = getBlockRenderedAnchorId(content.blocks, block, index)

    if (!anchor) {
      return
    }

    const title = getPlainText(block.data.text)

    if (!title) {
      return
    }

    const item: NavigationItem = {
      id: `${anchor}-${index}`,
      title,
      level: block.data.level,
      anchor,
      blockId: block.id,
      children: [],
    }

    while (true) {
      const previousItem = stack.at(-1)

      if (!previousItem || previousItem.level < item.level) {
        break
      }

      stack.pop()
    }

    const parent = stack[stack.length - 1]

    if (parent) {
      parent.children = [...(parent.children ?? []), item]
    } else {
      rootItems.push(item)
    }

    stack.push(item)
  })

  return rootItems
}

function getPlainText(value: string): string {
  return value
    .replaceAll(/<[^>]*>/g, ' ')
    .replaceAll(/&nbsp;/gi, ' ')
    .replaceAll(/&amp;/gi, '&')
    .replaceAll(/&[^;]+;/g, ' ')
    .replaceAll(/\s+/g, ' ')
    .trim()
}
