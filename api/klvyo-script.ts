import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Fetch the original Klaviyo onsite script
    const upstream = await fetch('https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=Tw6sBY');
    let js = await upstream.text();

    // Rewrite static-tracking and API domains to proxy routes
    const host = `https://${req.headers.host}`;
    js = js.replace(/static-tracking\.klaviyo\.com/g, `${host}/klvyo/static`);
    js = js.replace(/a\.klaviyo\.com/g, `${host}/klvyo/api`);

    res.setHeader('Content-Type', 'application/javascript');
    res.status(upstream.status).send(js);
  } catch (err) {
    res.status(500).send(`Proxy error: ${err}`);
  }
} 