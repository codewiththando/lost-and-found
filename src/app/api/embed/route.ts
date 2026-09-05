import { NextRequest, NextResponse } from 'next/server'
import { pipeline, RawImage } from '@huggingface/transformers'
import sharp from 'sharp'

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

    console.log('Fetching image:', imageUrl)
    const imageResponse = await fetch(imageUrl)
    const rawBuffer = Buffer.from(await imageResponse.arrayBuffer())

    console.log('Decoding image into raw pixels with sharp...')
    const { data, info } = await sharp(rawBuffer)
      .toColourspace('srgb')
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    // Build a RawImage directly from decoded pixel data.
    // This completely bypasses any URL/file loading inside the model,
    // which is what was failing before.
    const image = new RawImage(
      new Uint8ClampedArray(data),
      info.width,
      info.height,
      info.channels
    )

    console.log('Generating embedding...')
    const extractor = await getEmbedder()

    const output = await extractor(image, {
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