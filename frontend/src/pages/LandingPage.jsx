import React from 'react'
import { Link } from 'react-router-dom'

export default function LandingPage(){
	return (
		<div className="container">
			<h1>NPC Chatter</h1>
			<p>Welcome — a small demo site for NPC translations.</p>
			<div style={{display:'flex', gap:12}}>
				<Link to="/login"><button>Log in</button></Link>
				<Link to="/register"><button>Register</button></Link>
				<Link to="/translate"><button>Translate</button></Link>
			</div>
		</div>
	)
}
