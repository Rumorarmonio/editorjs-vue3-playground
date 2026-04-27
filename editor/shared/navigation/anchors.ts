import { getKnownBlockTuneData } from '~~/editor/shared/tunes/block-tunes'
import type { EditorContentBlock } from '~~/editor/shared/registry/block-registry'

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
