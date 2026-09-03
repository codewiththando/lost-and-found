import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function Home() {
  const { data: items, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Lost & Found</h1>
        <Link
          href="/post"
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-zinc-800"
        >
          Post an Item
        </Link>
      </div>

      {error && <p className="text-red-500">Error: {error.message}</p>}

      {items && items.length === 0 && (
        <p className="text-zinc-500">No items posted yet. Be the first!</p>
      )}

      <div className="flex flex-col gap-4">
        {items?.map((item) => (
          <div
            key={item.id}
            className="border border-zinc-200 rounded-lg p-4 flex justify-between items-start"
          >
            <div>
              <span
                className={`text-xs font-semibold uppercase px-2 py-1 rounded ${
                  item.type === 'lost'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {item.type}
              </span>
              <p className="mt-2 font-medium">{item.description}</p>
              <p className="text-sm text-zinc-500">{item.location}</p>
            </div>
            <span className="text-xs text-zinc-400">
              {new Date(item.created_at).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}