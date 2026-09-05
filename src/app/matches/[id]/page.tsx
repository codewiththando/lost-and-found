import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

export default async function MatchesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: item, error: itemError } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single()

  if (itemError || !item) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6">
        <p>Item not found.</p>
        <Link href="/" className="text-blue-500 underline">
          Back to homepage
        </Link>
      </div>
    )
  }

  const oppositeType = item.type === 'lost' ? 'found' : 'lost'

  let matches: any[] = []

  if (item.embedding) {
    const { data, error } = await supabase.rpc('match_items', {
      query_embedding: item.embedding,
      match_type: oppositeType,
      exclude_id: item.id,
      match_count: 5,
    })

    if (!error && data) {
      matches = data
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <Link href="/" className="text-sm text-zinc-500 hover:underline">
        ← Back to all items
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-2">Matches for: {item.description}</h1>
      <p className="text-zinc-500 mb-8">
        Showing possible {oppositeType} items that visually match this{' '}
        {item.type} item.
      </p>

      {!item.embedding && (
        <p className="text-amber-600">
          This item has no photo, so AI matching isn&apos;t available for it.
        </p>
      )}

      {item.embedding && matches.length === 0 && (
        <p className="text-zinc-500">No potential matches found yet.</p>
      )}

      <div className="flex flex-col gap-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="border border-zinc-200 rounded-lg p-4 flex gap-4 items-start"
          >
            {match.image_url && (
              <Image
                src={match.image_url}
                alt={match.description}
                width={80}
                height={80}
                className="rounded-md object-cover w-20 h-20 flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <span
                className={`text-xs font-semibold uppercase px-2 py-1 rounded ${
                  match.type === 'lost'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {match.type}
              </span>
              <p className="mt-2 font-medium">{match.description}</p>
              <p className="text-sm text-zinc-500">{match.location}</p>
              <p className="text-sm text-blue-600 mt-1">
                {Math.round(match.similarity * 100)}% match
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}