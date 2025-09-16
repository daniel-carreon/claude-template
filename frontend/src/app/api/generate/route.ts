import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

interface GenerateRequest {
  prompt: string
  numImages?: number
}

interface GeneratedImage {
  id: string
  url: string
  prompt: string
  timestamp: number
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, numImages = 10 }: GenerateRequest = await request.json()

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Model configuration
    const modelName = process.env.NEXT_PUBLIC_MODEL_NAME!
    const modelVersion = process.env.NEXT_PUBLIC_MODEL_VERSION!
    const triggerWord = process.env.NEXT_PUBLIC_TRIGGER_WORD!

    // Enhance prompt with trigger word if not already present
    const enhancedPrompt = prompt.toLowerCase().includes(triggerWord.toLowerCase())
      ? prompt
      : `${triggerWord} ${prompt}`

    console.log('🎯 Generating images with enhanced prompt:', enhancedPrompt)

    // Dynamic batch generation strategy based on numImages
    const batchSizes = []
    const maxPerBatch = 4 // Replicate limit
    let remaining = numImages

    while (remaining > 0) {
      const batchSize = Math.min(remaining, maxPerBatch)
      batchSizes.push(batchSize)
      remaining -= batchSize
    }
    const allImages: string[] = []

    for (let i = 0; i < batchSizes.length; i++) {
      const numOutputs = batchSizes[i]
      console.log(`🚀 Batch ${i + 1}: Generating ${numOutputs} images...`)

      try {
        const output = await replicate.run(
          `${modelName}:${modelVersion}`,
          {
            input: {
              prompt: enhancedPrompt,
              num_outputs: numOutputs,
              aspect_ratio: "16:9",
              output_format: "webp",
              output_quality: 90,
              num_inference_steps: 28,
              guidance_scale: 3.5,
              prompt_strength: 0.8,
              extra_lora_scale: 0.8,
              lora_scale: 1
            }
          }
        ) as string[]

        if (Array.isArray(output)) {
          allImages.push(...output)
          console.log(`✅ Batch ${i + 1}: Generated ${output.length} images successfully`)
        } else {
          console.warn(`⚠️ Batch ${i + 1}: Unexpected output format:`, typeof output)
        }
      } catch (batchError) {
        console.error(`❌ Batch ${i + 1} failed:`, batchError)
        // Continue with other batches even if one fails
      }
    }

    if (allImages.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate any images' },
        { status: 500 }
      )
    }

    // Transform URLs to GeneratedImage objects
    const generatedImages: GeneratedImage[] = allImages.map((url, index) => ({
      id: `img_${Date.now()}_${index}`,
      url,
      prompt: enhancedPrompt,
      timestamp: Date.now()
    }))

    console.log(`🎉 Successfully generated ${generatedImages.length} images total`)

    return NextResponse.json({
      images: generatedImages,
      total: generatedImages.length,
      prompt: enhancedPrompt
    })

  } catch (error) {
    console.error('❌ Generation failed:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate images',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}