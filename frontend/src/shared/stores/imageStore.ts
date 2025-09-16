import { create } from 'zustand'

export interface GeneratedImage {
  id: string
  url: string
  prompt: string
  isSelected: boolean
  createdAt: Date
}

export interface SavedImage {
  id: string
  originalUrl: string
  supabaseUrl: string
  prompt: string
  savedAt: Date
}

interface ImageStore {
  // Generation state
  isGenerating: boolean
  generationProgress: number
  currentPrompt: string
  error: string | null

  // Images state
  generatedImages: GeneratedImage[]
  favoriteImages: SavedImage[]

  // Actions
  setGenerating: (isGenerating: boolean) => void
  setProgress: (progress: number) => void
  setPrompt: (prompt: string) => void
  setError: (error: string | null) => void

  // Image actions
  setGeneratedImages: (images: GeneratedImage[]) => void
  toggleImageSelection: (imageId: string) => void
  getSelectedImages: () => GeneratedImage[]
  addFavorite: (image: SavedImage) => void
  removeFavorite: (imageId: string) => void
  clearGenerated: () => void
  reset: () => void
}

export const useImageStore = create<ImageStore>((set, get) => ({
  // Initial state
  isGenerating: false,
  generationProgress: 0,
  currentPrompt: '',
  error: null,
  generatedImages: [],
  favoriteImages: [],

  // Basic setters
  setGenerating: (isGenerating) => set({ isGenerating }),
  setProgress: (generationProgress) => set({ generationProgress }),
  setPrompt: (currentPrompt) => set({ currentPrompt }),
  setError: (error) => set({ error }),

  // Image actions
  setGeneratedImages: (generatedImages) => set({ generatedImages }),

  toggleImageSelection: (imageId) => set((state) => ({
    generatedImages: state.generatedImages.map(img =>
      img.id === imageId ? { ...img, isSelected: !img.isSelected } : img
    )
  })),

  getSelectedImages: () => {
    const { generatedImages } = get()
    return generatedImages.filter(img => img.isSelected)
  },

  addFavorite: (image) => set((state) => ({
    favoriteImages: [...state.favoriteImages, image]
  })),

  removeFavorite: (imageId) => set((state) => ({
    favoriteImages: state.favoriteImages.filter(img => img.id !== imageId)
  })),

  clearGenerated: () => set({
    generatedImages: [],
    generationProgress: 0,
    error: null
  }),

  reset: () => set({
    isGenerating: false,
    generationProgress: 0,
    currentPrompt: '',
    error: null,
    generatedImages: [],
  })
}))