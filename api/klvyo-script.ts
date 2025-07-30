import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {  try {
    const upstream = await fetch('https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=Tw6sBY');
    let js = await upstream.text();

    const host = `https://${req.headers.host || 'ph-ingest.samphireneuro.com'}`;
    js = js.replace(/static-tracking\.klaviyo\.com/g, `${host}/klvyo/static`);
    js = js.replace(/a\.klaviyo\.com/g, `${host}/klvyo/api`);

    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.status(200).send(js);
  } catch (err) {
    console.error('Klaviyo proxy error:', err);
    res.status(500).send(`Proxy error: ${err instanceof Error ? err.message : String(err)}`);
  }
}