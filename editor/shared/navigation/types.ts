export interface NavigationItem {
  id: string
  title: string
  level: number
  anchor: string
  blockId?: string
  children?: NavigationItem[]
}
