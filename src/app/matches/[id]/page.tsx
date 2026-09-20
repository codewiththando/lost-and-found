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
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-[#647184]">Item not found.</p>
        <Link href="/" className="text-[#2C5F8A] hover:underline">
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
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/" className="text-sm text-[#647184] hover:text-[#2C5F8A]">
        ← Back to all items
      </Link>

      <h1
        className="text-2xl text-[#1C2530] mt-4 mb-2"
        style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
      >
        Matches for: {item.description}
      </h1>
      <p className="text-[#647184] mb-8">
        Showing possible {oppositeType} items that visually match this{' '}
        {item.type} item.
      </p>

      {!item.embedding && (
        <p className="text-[#A8503E] text-sm">
          This item has no photo, so AI matching isn&apos;t available for it.
        </p>
      )}

      {item.embedding && matches.length === 0 && (
        <p className="text-[#647184] border border-dashed border-[#E2E6EB] rounded p-8 text-center">
          No potential matches found yet.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {matches.map((match) => {
          const statusColor = match.type === 'lost' ? '#A8503E' : '#2C5F8A'
          return (
            <div
              key={match.id}
              className="bg-white border border-[#E2E6EB] rounded flex gap-4 p-4 pl-5 relative overflow-hidden"
            >
              <span
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{ backgroundColor: statusColor }}
              />

              {match.image_url && (
                <Image
                  src={match.image_url}
                  alt={match.description}
                  width={72}
                  height={72}
                  className="rounded object-cover w-[72px] h-[72px] flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <span
                  className="text-xs font-medium uppercase tracking-wide"
                  style={{ color: statusColor }}
                >
                  {match.type}
                </span>
                <p className="mt-1 font-medium text-[#1C2530]">
                  {match.description}
                </p>
                <p className="text-sm text-[#647184]">{match.location}</p>
                <p className="text-sm text-[#2C5F8A] mt-1">
                  {Math.round(match.similarity * 100)}% match
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}