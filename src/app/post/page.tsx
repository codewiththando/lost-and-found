'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

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

    // If a file was selected, upload it first
    if (file) {
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

      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('item-images')
        .getPublicUrl(fileName)

      imageUrl = publicUrlData.publicUrl
    }

    const { error } = await supabase.from('items').insert({
      description,
      type,
      location,
      user_id: user.id,
      image_url: imageUrl,
    })

    setSubmitting(false)

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Item posted successfully!')
      setDescription('')
      setType('lost')
      setLocation('')
      setFile(null)
    }
  }

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>
  if (!user) return null

  return (
    <div style={{ padding: '2rem', maxWidth: '500px' }}>
      <h1>Post a Lost or Found Item</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </label>

        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Blue Jansport backpack"
            required
          />
        </label>

        <label>
          Location:
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Library, 2nd floor"
            required
          />
        </label>

        <label>
          Photo (optional):
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Posting...' : 'Post Item'}
        </button>

        {message && <p>{message}</p>}
      </form>
    </div>
  )
}