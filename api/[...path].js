export default async function handler(req, res) {
  const backendBase = 'https://npccv2-backend.fly.dev'
  const path = req.query.path || []
  const target = `${backendBase}/${path.join('/')}`

  const headers = { ...req.headers }
  // Remove host header to avoid backend rejecting it
  delete headers.host

  try {
    const fetchRes = await fetch(target, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
      redirect: 'manual'
    })

    // Copy status
    res.status(fetchRes.status)

    // Copy headers, but avoid forwarding hop-by-hop headers
    const excluded = ['transfer-encoding', 'content-encoding', 'content-length']
    fetchRes.headers.forEach((value, key) => {
      if (!excluded.includes(key.toLowerCase())) {
        // If backend sets Set-Cookie, forward it so browser can set cookie for Vercel origin
        res.setHeader(key, value)
      }
    })

    const body = await fetchRes.arrayBuffer()
    res.send(Buffer.from(body))
  } catch (err) {
    console.error('proxy error', err)
    res.status(502).json({ error: 'bad gateway', details: String(err) })
  }
}
