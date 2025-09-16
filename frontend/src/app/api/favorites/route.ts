import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface SaveFavoriteRequest {
  imageId: string
  originalUrl: string
  prompt: string
}

export async function POST(request: NextRequest) {
  try {
    const { imageId, originalUrl, prompt }: SaveFavoriteRequest = await request.json()

    if (!imageId || !originalUrl || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields: imageId, originalUrl, prompt' },
        { status: 400 }
      )
    }

    console.log('💾 Saving favorite image:', { imageId, prompt })

    // First, download the image from the original URL
    const imageResponse = await fetch(originalUrl)
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image from original URL')
    }

    const imageBlob = await imageResponse.blob()
    const fileName = `favorites/${imageId}.webp`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, imageBlob, {
        contentType: 'image/webp',
        upsert: true
      })

    if (uploadError) {
      console.error('❌ Upload error:', uploadError)
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName)

    const supabaseUrl = publicUrlData.publicUrl

    // Save to database
    const { data: dbData, error: dbError } = await supabase
      .from('favorite_images')
      .insert({
        image_id: imageId,
        original_url: originalUrl,
        supabase_url: supabaseUrl,
        prompt: prompt
      })
      .select()
      .single()

    if (dbError) {
      console.error('❌ Database error:', dbError)
      throw new Error(`Database save failed: ${dbError.message}`)
    }

    console.log('✅ Successfully saved favorite image')

    return NextResponse.json({
      success: true,
      data: {
        id: dbData.id,
        supabaseUrl,
        originalUrl,
        prompt,
        savedAt: dbData.saved_at
      }
    })

  } catch (error) {
    console.error('❌ Save favorite failed:', error)
    return NextResponse.json(
      {
        error: 'Failed to save favorite image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('favorite_images')
      .select('*')
      .order('saved_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch favorites: ${error.message}`)
    }

    return NextResponse.json({
      favorites: data || []
    })
  } catch (error) {
    console.error('❌ Fetch favorites failed:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch favorite images',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}