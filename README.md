# Lost & Found

An AI-powered Lost & Found platform for campus communities. Users report lost or found items with a photo, and the app automatically suggests likely matches using AI-based image similarity search — no manual searching required.

## Live Demo

**[lostfoundapp.vercel.app](https://lostfoundapp.vercel.app/)**

## How It Works

When a photo is uploaded, the app generates an AI "fingerprint" of the image (a 512-number vector) using OpenAI's CLIP model, run entirely in the browser. This vector is stored alongside the item in a Postgres database with vector search enabled (`pgvector`). When someone views an item, the app runs a similarity search against all opposite-type items (lost items are matched against found items, and vice versa) and ranks them by visual similarity — so a lost blue backpack automatically surfaces a visually similar found backpack, even if the descriptions use completely different words.

## Features

- Email/password authentication (Supabase Auth)
- Post lost or found items with a photo, description, and location
- **AI-powered visual matching** — CLIP image embeddings generated client-side, compared via cosine similarity in Postgres
- Row Level Security: posting is restricted to logged-in users; each item is tied to its owner
- Responsive, custom-designed UI (not a template)

## Tech Stack

- **Framework:** Next.js (App Router), React, TypeScript
- **Database & Auth:** Supabase (Postgres, Auth, Storage, `pgvector`)
- **AI:** `@huggingface/transformers` (CLIP `Xenova/clip-vit-base-patch32`), run in-browser via WebAssembly
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Architecture Notes

The AI embedding generation originally ran server-side via a Next.js API route, but hit a compatibility bug between Node's `sharp` image library and the model's internal image resizing. Rather than patch around it, the embedding step was moved to run **client-side in the browser** (using WebAssembly), which sidesteps the Node-specific bug entirely and also reduces server load — each user's browser does its own AI inference.

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/codewiththando/lost-and-found
cd lost-and-found
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the project root:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key


### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## Database Setup

This project uses Supabase Postgres with the `pgvector` extension enabled for similarity search. The `items` table stores a 512-dimension `embedding` column, and a `match_items` SQL function performs the cosine-similarity ranking.

## Author

**Thando Mavuso**
Information Technology Student
GitHub: [@codewiththando](https://github.com/codewiththando)