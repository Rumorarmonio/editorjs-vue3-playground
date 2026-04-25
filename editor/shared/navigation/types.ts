export interface NavigationItem {
  id: string
  title: string
  level: number
  blockId?: string
  children?: NavigationItem[]
}
