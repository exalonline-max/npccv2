import axios from 'axios'

const protocol = (typeof window !== 'undefined' && window.location && window.location.protocol) ? window.location.protocol : 'http:'
const instance = axios.create({
  baseURL: `${protocol}//api.lvh.me:5001/api`,
  withCredentials: true,
})

export default instance
