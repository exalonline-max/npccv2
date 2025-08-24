import axios from 'axios'

// Prefer VITE_API_URL (set at build time in Vercel or locally) so the frontend
// can be pointed at the deployed backend. Fall back to the previous
// development default (api.lvh.me:5001) to preserve local dev behavior.
const viteApi = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL : null

function buildBaseURL() {
  if (viteApi) {
    // allow the var to be set with or without a trailing slash or /api suffix
    return viteApi.replace(/\/+$/,'').replace(/\/api$/, '') + '/api'
  }
  const protocol = (typeof window !== 'undefined' && window.location && window.location.protocol) ? window.location.protocol : 'http:'
  return `${protocol}//api.lvh.me:5001/api`
}

const instance = axios.create({
  baseURL: buildBaseURL(),
  withCredentials: true,
})

export default instance
