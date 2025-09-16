import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // No auth for MVP
  },
})

// Storage helpers
export const uploadImage = async (file: File, path: string) => {
  const { data, error } = await supabase.storage
    .from('generated-images')
    .upload(path, file, {
      upsert: true,
      contentType: file.type,
    })

  if (error) throw error
  return data
}

export const getPublicUrl = (path: string) => {
  const { data } = supabase.storage
    .from('generated-images')
    .getPublicUrl(path)

  return data.publicUrl
}

export const downloadImage = async (url: string, filename: string): Promise<File> => {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to download image')

  const blob = await response.blob()
  return new File([blob], filename, { type: blob.type })
}