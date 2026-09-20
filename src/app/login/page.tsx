'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16 px-6">
      <h1
        className="text-2xl text-[#1C2530] mb-6"
        style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
      >
        Log in
      </h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
            className="border border-[#E2E6EB] rounded px-3 py-2 text-[#1C2530] bg-white focus:outline-none focus:border-[#2C5F8A]"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#2C5F8A] text-white rounded px-4 py-2 mt-2 hover:bg-[#244d70] disabled:opacity-60"
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>

        {message && <p className="text-sm text-[#A8503E]">{message}</p>}
      </form>

      <p className="text-sm text-[#647184] mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-[#2C5F8A] hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}