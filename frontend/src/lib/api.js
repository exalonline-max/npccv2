import axios from 'axios'

// Resolve base URL for API calls.
// - If VITE_API_URL is set at build time, use it (useful for pointing at a remote backend).
// - In production builds with no VITE_API_URL, default to a relative '/api' so requests stay same-origin
//   (this allows the Vercel proxy route to forward to the Fly backend and avoids CORS).
// - In development (non-production) with no VITE_API_URL, fall back to api.lvh.me:5001 for local testing.
const viteApi = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL : null

function buildBaseURL() {
  // In the browser (client-side), always use the relative '/api' path so requests are same-origin
  // and will be routed through Vercel's proxy. This reliably avoids cross-origin CORS failures.
  if (typeof window !== 'undefined') {
    return '/api'
  }

  // Node-side (SSR/build tooling) or dev-only: prefer explicit VITE_API_URL if provided.
  if (viteApi) {
    return viteApi.replace(/\/+$/,'').replace(/\/api$/, '') + '/api'
  }

  // Default fallback for non-browser dev/test: api.lvh.me local backend
  const protocol = 'http:'
  return `${protocol}//api.lvh.me:5001/api`
}

const instance = axios.create({
  baseURL: buildBaseURL(),
  withCredentials: true,
})

export default instance
