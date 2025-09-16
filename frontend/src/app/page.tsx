'use client'

import { useState } from 'react'
import { useImageStore } from '@/shared/stores/imageStore'

interface ApiResponse {
  images: Array<{
    id: string
    url: string
    prompt: string
    timestamp: number
  }>
  total: number
  prompt: string
}

export default function HomePage() {
  const [prompt, setPrompt] = useState('')
  const {
    isGenerating,
    generatedImages,
    setGenerating,
    setGeneratedImages,
    clearGenerated
  } = useImageStore()

  const handleSaveFavorite = async (image: { id: string; url: string; prompt: string }) => {
    try {
      console.log('💾 Saving to favorites:', image.id)

      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId: image.id,
          originalUrl: image.url,
          prompt: image.prompt,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save favorite')
      }

      const data = await response.json()
      console.log('✅ Successfully saved to favorites:', data)
      alert('✅ Image saved to favorites!')

    } catch (error) {
      console.error('❌ Failed to save favorite:', error)
      alert(`❌ Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setGenerating(true)
    clearGenerated()

    try {
      console.log('🎯 Generating images for:', prompt)

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Generation failed')
      }

      const data: ApiResponse = await response.json()
      // Transform API response to store format
      const transformedImages = data.images.map(img => ({
        ...img,
        isSelected: false,
        createdAt: new Date(img.timestamp)
      }))
      setGeneratedImages(transformedImages)
      console.log(`✅ Generated ${data.total} images successfully`)

    } catch (error) {
      console.error('❌ Generation failed:', error)
      alert(`Failed to generate images: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Prompt Input Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Generate Images</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium mb-2">
              Describe your image
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="DANI portrait for tech review thumbnail"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              disabled={isGenerating}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="btn btn-primary disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate 10 Images'}
          </button>
        </div>
      </div>

      {/* Status Section */}
      {isGenerating && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <div>
              <p className="text-blue-800 font-medium">Generating 10 images...</p>
              <p className="text-blue-600 text-sm">This may take 30-60 seconds</p>
            </div>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {generatedImages.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">
            Generated Images ({generatedImages.length})
          </h2>
          <div className="image-grid">
            {generatedImages.map((image) => (
              <div key={image.id} className="image-card">
                <img
                  src={image.url}
                  alt={`Generated from: ${image.prompt}`}
                  className="w-full h-32 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all">
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleSaveFavorite(image)}
                      className="w-full btn btn-primary btn-sm"
                    >
                      ❤️ Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isGenerating && generatedImages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to create</h3>
          <p className="text-gray-600">
            Enter a prompt above to generate 10 personalized images using your fine-tuned model
          </p>
        </div>
      )}
    </div>
  )
}