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
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        borderBottom: '1px solid #333',
      }}
    >
      <Link href="/" style={{ fontWeight: 'bold' }}>
        Lost & Found
      </Link>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {loading ? null : user ? (
          <>
            <span style={{ fontSize: '0.9rem' }}>{user.email}</span>
            <button onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <>
            <Link href="/login">Log In</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}