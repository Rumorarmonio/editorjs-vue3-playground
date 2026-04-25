import type { EditorContentData } from '~~/editor/shared/types/content'

export interface ContentPage {
  id: string
  title: string
  content: EditorContentData
}
