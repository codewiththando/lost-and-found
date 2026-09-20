# Lost & Found

A web-based Lost & Found platform designed to help users report, search for, and manage lost and found items.

## Live Demo

**Live Website:** https://lostfoundapp.vercel.app/

## About the Project

Lost & Found provides a simple platform where users can report items they have lost or found. The goal is to make it easier for people to find missing belongings and connect with their owners.

## Features

* User registration and login
* Report lost items
* Report found items
* Browse lost and found items
* Search for items
* Manage reported items
* User authentication
* Database storage
* Responsive interface

## Technologies Used

* Next.js
* React
* TypeScript
* Supabase
* Tailwind CSS
* Vercel
* GitHub

## Supabase

Supabase is used for:

* User authentication
* Database management
* Storing lost and found item information

Environment variables are required to connect the application to Supabase.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/codewiththando/lost-and-found
```

### 2. Navigate to the project

```bash
cd lost-and-found
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the root of the project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

Do not share your Supabase keys publicly.

### 5. Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Deployment

The application is deployed using Vercel.

**Live Website:** YOUR_VERCEL_URL

## Author

**Thando Mavuso**

Information Technology Student

GitHub: [codewiththando](https://github.com/codewiththando)
