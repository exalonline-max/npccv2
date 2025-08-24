import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../state/authStore'

export default function LandingPage(){
  const user = useAuthStore(s => s.user)

  return (
    <div className="min-h-screen bg-base-100">
      <header className="bg-gradient-to-r from-primary/90 to-secondary/80 text-white py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block mb-6">
              {/* simple inline SVG illustration to avoid external assets */}
              <svg width="120" height="120" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <rect width="64" height="64" rx="12" fill="#0ea5a4" />
                <g transform="translate(9,10)" fill="#fff">
                  <path d="M20 0a12 12 0 1 0 0 24c.9 0 1.8-.1 2.6-.3l6.4 3.5c.3.2.7 0 .6-.4L28 18.8c1.7-1.6 2.7-3.9 2.7-6.3A12 12 0 0 0 20 0z" />
                  <circle cx="6" cy="8" r="1.6" />
                  <circle cx="12" cy="8" r="1.6" />
                  <path d="M2 18c1-1 3-2 6-2s5 1 6 2c.8.8 1 2 1 3H1c0-1 .2-2.2 1-3z" />
                </g>
              </svg>
            </div>
            <h1 className="text-5xl font-extrabold drop-shadow-md">NPC Chatter</h1>
            <p className="mt-4 text-lg max-w-xl mx-auto opacity-95">A cozy, powerful chat app built for tabletop storytellers — run private campaigns, keep player notes, and roleplay with dynamic NPCs.</p>

            <div className="mt-8 flex justify-center gap-4">
              {user ? (
                <>
                  <Link className="btn btn-neutral btn-lg" to="/campaigns">Open your campaigns</Link>
                  <Link className="btn btn-outline btn-lg" to="/campaigns/create">Create campaign</Link>
                </>
              ) : (
                <>
                  <Link className="btn btn-primary btn-lg" to="/login">Sign in</Link>
                  <Link className="btn btn-ghost btn-lg" to="/register">Get started — it's free</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 -mt-12">
        <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <article className="card p-6 shadow-md">
            <h3 className="font-semibold text-xl">Real-time group chat</h3>
            <p className="mt-2 text-sm text-muted-foreground">Keep the story moving with low-latency text chat, threaded NPC dialogue, and easy role assignments.</p>
          </article>

          <article className="card p-6 shadow-md">
            <h3 className="font-semibold text-xl">DM tools & notes</h3>
            <p className="mt-2 text-sm text-muted-foreground">Organize session notes, private NPC prompts, and scene bookmarks so every session flows smoothly.</p>
          </article>

          <article className="card p-6 shadow-md">
            <h3 className="font-semibold text-xl">Invite players instantly</h3>
            <p className="mt-2 text-sm text-muted-foreground">Share a campaign link and players join in seconds — no complicated setup required.</p>
          </article>

          <article className="card p-6 shadow-md">
            <h3 className="font-semibold text-xl">Safe & private</h3>
            <p className="mt-2 text-sm text-muted-foreground">Campaigns are isolated by subdomain and protected by cookie-based sessions so your world stays yours.</p>
          </article>

          <article className="card p-6 shadow-md">
            <h3 className="font-semibold text-xl">Lightweight & fast</h3>
            <p className="mt-2 text-sm text-muted-foreground">Built with modern web tooling for quick loads and a responsive experience across devices.</p>
          </article>

          <article className="card p-6 shadow-md">
            <h3 className="font-semibold text-xl">Built for fun</h3>
            <p className="mt-2 text-sm text-muted-foreground">Roleplay, improv, and collaborate — NPC Chatter makes running games feel effortless and delightful.</p>
          </article>
        </section>

        <section className="mt-12 text-center">
          <h2 className="text-2xl font-bold">Ready to tell better stories?</h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl mx-auto">Whether you run weekly campaigns or one-shot adventures, NPC Chatter helps you keep players engaged and sessions on-track. Sign in to pick up where you left off, or create a campaign and invite your group.</p>
          <div className="mt-6 flex justify-center gap-4">
            <Link className="btn btn-primary" to="/register">Create a campaign</Link>
            <Link className="btn btn-outline" to="/login">Sign in</Link>
          </div>
        </section>

        <footer className="mt-16 mb-24 text-center text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} NPC Chatter — Made for storytellers.</div>
        </footer>
      </main>
    </div>
  )
}
