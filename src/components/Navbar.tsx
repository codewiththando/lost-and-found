'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { user, loading } = useAuth()
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="border-b border-[#E2E6EB] bg-white">
      <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-lg text-[#1C2530]"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          Lost &amp; Found
        </Link>

        <div className="flex gap-5 items-center text-sm">
          {loading ? null : user ? (
            <>
              <span className="text-[#647184]">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-[#1C2530] hover:text-[#2C5F8A]"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-[#1C2530] hover:text-[#2C5F8A]">
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-[#2C5F8A] text-white px-4 py-2 rounded hover:bg-[#244d70]"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}