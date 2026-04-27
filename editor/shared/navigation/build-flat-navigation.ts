import { getKnownBlockTuneData } from '~~/editor/shared/tunes/block-tunes'
import { getBlockAnchorId } from './anchors'
import type { EditorContentData } from '~~/editor/shared/types/content'
import type { NavigationItem } from './types'

export function buildFlatNavigationItems(
  content: EditorContentData,
): NavigationItem[] {
  return content.blocks.flatMap((block, index) => {
    const tunes = getKnownBlockTuneData(block.tunes)
    const title = tunes.label?.label
    const anchor = getBlockAnchorId(content.blocks, block, index)

    if (!title || !anchor) {
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
