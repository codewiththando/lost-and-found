import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

export default async function Home() {
  const { data: items, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-2">
        <h1
          className="text-3xl text-[#1C2530]"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          Lost &amp; Found
        </h1>
        <Link
          href="/post"
          className="bg-[#2C5F8A] text-white px-4 py-2 rounded hover:bg-[#244d70] text-sm"
        >
          Post an item
        </Link>
      </div>
      <p className="text-[#647184] mb-10">
        Find what&apos;s missing. Return what you found.
      </p>

      {error && <p className="text-[#A8503E]">Error: {error.message}</p>}

      {items && items.length === 0 && (
        <p className="text-[#647184] border border-dashed border-[#E2E6EB] rounded p-8 text-center">
          No items posted yet. Be the first.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {items?.map((item) => {
          const statusColor = item.type === 'lost' ? '#A8503E' : '#2C5F8A'
          return (
            <div
              key={item.id}
              className="bg-white border border-[#E2E6EB] rounded flex gap-4 p-4 pl-5 relative overflow-hidden"
            >
              <span
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{ backgroundColor: statusColor }}
              />

              {item.image_url && (
                <Image
                  src={item.image_url}
                  alt={item.description}
                  width={72}
                  height={72}
                  className="rounded object-cover w-[72px] h-[72px] flex-shrink-0"
                />
              )}

              <div className="flex-1 flex justify-between items-start">
                <div>
                  <span
                    className="text-xs font-medium uppercase tracking-wide"
                    style={{ color: statusColor }}
                  >
                    {item.type}
                  </span>
                  <p className="mt-1 font-medium text-[#1C2530]">
                    {item.description}
                  </p>
                  <p className="text-sm text-[#647184]">{item.location}</p>

                  {item.embedding && (
                    <Link
                      href={`/matches/${item.id}`}
                      className="inline-block mt-2 text-sm text-[#2C5F8A] hover:underline"
                    >
                      Find matches
                    </Link>
                  )}
                </div>
                <span className="text-xs text-[#647184] whitespace-nowrap ml-4">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}