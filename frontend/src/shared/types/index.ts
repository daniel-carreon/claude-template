// API Types
export interface GenerateRequest {
  prompt: string
  num_images?: number
  aspect_ratio?: string
  output_format?: string
}

export interface GenerateResponse {
  success: boolean
  images?: string[]
  error?: string
  metadata?: {
    model: string
    version: string
    prompt: string
    generated_at: string
  }
}

// Image Types
export interface ImageMetadata {
  width: number
  height: number
  format: string
  size: number
}

export interface GenerationConfig {
  model: string
  version: string
  triggerWord: string
  maxImages: number
  defaultAspectRatio: string
}

// Storage Types
export interface StorageUpload {
  path: string
  url: string
  metadata?: Record<string, any>
}

// UI State Types
export type ViewMode = 'generator' | 'favorites'

export interface UIState {
  view: ViewMode
  isLoading: boolean
  error: string | null
}

// Error Types
export interface AppError {
  code: string
  message: string
  details?: any
}

// Constants
export const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'] as const
export const ASPECT_RATIOS = ['1:1', '16:9', '4:3', '3:4', '9:16'] as const

export type SupportedFormat = typeof SUPPORTED_FORMATS[number]
export type AspectRatio = typeof ASPECT_RATIOS[number]