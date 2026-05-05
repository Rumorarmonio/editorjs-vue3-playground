export interface ImageItem {
  mediaId?: number
  url: string
  caption?: string
  alt?: string
}

export interface ImageItemWithLink extends ImageItem {
  to?: string
}

export interface EditorImageUploadResult {
  success: 0 | 1
  file?: {
    url: string
  }
  message?: string
}

export interface EditorImageUploader {
  uploadByFile: (file: File) => Promise<EditorImageUploadResult>
  uploadByUrl: (url: string) => Promise<EditorImageUploadResult>
}

export function isAllowedMediaUrl(url: string): boolean {
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
