'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

let embedderPromise: any = null

async function getEmbedder() {
  if (!embedderPromise) {
    const { pipeline } = await import('@huggingface/transformers')
    embedderPromise = pipeline(
      'image-feature-extraction',
      'Xenova/clip-vit-base-patch32'
    )
  }
  return embedderPromise
}

const inputClass =
  'border border-[#E2E6EB] rounded px-3 py-2 text-[#1C2530] bg-white focus:outline-none focus:border-[#2C5F8A]'
const labelClass = 'flex flex-col gap-1 text-sm text-[#647184]'

export default function PostItem() {
  const [description, setDescription] = useState('')
  const [type, setType] = useState('lost')
  const [location, setLocation] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)
    setMessage('')

    let imageUrl: string | null = null
    let embedding: number[] | null = null

    if (file) {
      setMessage('Uploading image...')

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('item-images')
        .upload(fileName, file)

      if (uploadError) {
        setSubmitting(false)
        setMessage('Upload error: ' + uploadError.message)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('item-images')
        .getPublicUrl(fileName)

      imageUrl = publicUrlData.publicUrl

      setMessage('Analyzing image with AI...')

      try {
        const extractor = await getEmbedder()
        const objectUrl = URL.createObjectURL(file)
        const output = await extractor(objectUrl, {
          pooling: 'mean',
          normalize: true,
        })
        URL.revokeObjectURL(objectUrl)
        embedding = Array.from(output.data as Float32Array)
      } catch (err) {
        console.warn('Embedding failed, continuing without it:', err)
      }
    }

    setMessage('Saving item...')

    const { error } = await supabase.from('items').insert({
      description,
      type,
      location,
      user_id: user.id,
      image_url: imageUrl,
      embedding: embedding ? JSON.stringify(embedding) : null,
    })

    setSubmitting(false)

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Item posted successfully.')
      setDescription('')
      setType('lost')
      setLocation('')
      setFile(null)
    }
  }

  if (loading) return <p className="p-8 text-[#647184]">Loading...</p>
  if (!user) return null

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <h1
        className="text-2xl text-[#1C2530] mb-6"
        style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
      >
        Post a lost or found item
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className={labelClass}>
          Type
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={inputClass}
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </label>

        <label className={labelClass}>
          Description
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Blue Jansport backpack"
            required
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Location
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Library, 2nd floor"
            required
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Photo (optional, but needed for AI matching)
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm text-[#647184]"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="bg-[#2C5F8A] text-white rounded px-4 py-2 mt-2 hover:bg-[#244d70] disabled:opacity-60"
        >
          {submitting ? 'Posting...' : 'Post item'}
        </button>

        {message && <p className="text-sm text-[#647184]">{message}</p>}
      </form>
    </div>
  )
}