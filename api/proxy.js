// api/proxy.js
export default async function handler(req, res) {
  // 🔓 Configuração CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, apikey');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // 🔗 URL base do Supabase
  const base = "https://rejzyzaaltewprqjexpd.supabase.co";
  const url = base + req.url;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'content-type': req.headers['content-type'] || 'application/json',
        'authorization': req.headers['authorization'] || '',
        'apikey': req.headers['apikey'] || ''
      },
      body: req.method === 'GET' || req.method === 'HEAD' ? undefined : req.body
    });

    const data = await response.arrayBuffer();
    res.status(response.status);
    res.setHeader('content-type', response.headers.get('content-type') || 'application/json');
    res.send(Buffer.from(data));

  } catch (error) {
    console.error('❌ Erro no proxy:', error);
    res.status(500).json({ error: String(error) });
  }
}
