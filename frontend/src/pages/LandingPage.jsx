import React from 'react'
import { Link } from 'react-router-dom'

export default function LandingPage(){
  return (
    <div className="max-w-2xl mx-auto mt-20 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to NPC Chatter</h1>
      <p className="mb-6">Create a campaign or sign in to manage your campaigns and chat with players.</p>
      <div className="flex justify-center space-x-4">
        <Link className="btn btn-primary" to="/login">Sign in</Link>
  <Link className="btn" to="/register">Create campaign</Link>
      </div>
    </div>
  )
}
