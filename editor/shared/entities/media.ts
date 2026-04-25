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
