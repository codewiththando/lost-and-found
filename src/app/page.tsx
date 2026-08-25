import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data, error } = await supabase.from('items').select('*')

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Test: Items from Supabase</h1>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}