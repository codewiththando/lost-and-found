'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Success! Check your email to confirm your account.')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16 px-6">
      <h1
        className="text-2xl text-[#1C2530] mb-6"
        style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
      >
        Sign up
      </h1>

      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-[#647184]">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-[#E2E6EB] rounded px-3 py-2 text-[#1C2530] bg-white focus:outline-none focus:border-[#2C5F8A]"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-[#647184]">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="border border-[#E2E6EB] rounded px-3 py-2 text-[#1C2530] bg-white focus:outline-none focus:border-[#2C5F8A]"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#2C5F8A] text-white rounded px-4 py-2 mt-2 hover:bg-[#244d70] disabled:opacity-60"
        >
          {loading ? 'Signing up...' : 'Sign up'}
        </button>

        {message && (
          <p className="text-sm text-[#647184]">{message}</p>
        )}
      </form>

      <p className="text-sm text-[#647184] mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-[#2C5F8A] hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}