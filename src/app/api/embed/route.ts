import { NextRequest, NextResponse } from 'next/server'
import { pipeline } from '@huggingface/transformers'

// We load the model once and reuse it across requests, instead of
// reloading it every single time (which would be very slow).
let embedder: any = null

async function getEmbedder() {
  if (!embedder) {
    console.log('Loading CLIP model for the first time... this may take a minute.')
    embedder = await pipeline(
      'image-feature-extraction',
      'Xenova/clip-vit-base-patch32'
    )
    console.log('CLIP model loaded and ready.')
  }
  return embedder
}

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 })
    }

    console.log('Generating embedding for', imageUrl)

    const extractor = await getEmbedder()

    const output = await extractor(imageUrl, {
      pooling: 'mean',
      normalize: true,
    })

    const embedding = Array.from(output.data as Float32Array)

    console.log('Embedding generated, length:', embedding.length)

    return NextResponse.json({ embedding })
  } catch (err) {
    console.error('Embedding error:', err)
    return NextResponse.json(
      { error: 'Server error: ' + (err as Error).message },
      { status: 500 }
    )
  }
}