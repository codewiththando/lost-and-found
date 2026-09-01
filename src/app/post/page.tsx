'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function PostItem() {
  const [description, setDescription] = useState('')
  const [type, setType] = useState('lost')
  const [location, setLocation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    const { error } = await supabase.from('items').insert({
      description,
      type,
      location,
    })

    setSubmitting(false)

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Item posted successfully!')
      setDescription('')
      setType('lost')
      setLocation('')
    }
  }

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

        <button type="submit" disabled={submitting}>
          {submitting ? 'Posting...' : 'Post Item'}
        </button>

        {message && <p>{message}</p>}
      </form>
    </div>
  )
}