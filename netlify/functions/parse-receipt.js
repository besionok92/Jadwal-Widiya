/**
 * Netlify serverless function: parse-receipt
 * Accepts a base64 JPEG, sends it to Claude Vision, returns structured JSON.
 *
 * Required env var in Netlify dashboard: ANTHROPIC_API_KEY
 */
exports.handler = async (event) => {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'ANTHROPIC_API_KEY not set in Netlify environment variables' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { imageBase64, mediaType = 'image/jpeg' } = body;
  if (!imageBase64) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'imageBase64 required' }) };
  }

  // Strip data URL prefix if present (e.g. "data:image/jpeg;base64,...")
  const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

  const prompt = `You are a receipt parser. Examine this receipt image carefully and extract all data.

Return ONLY a single valid JSON object — no markdown, no explanation, no code fences — in this exact shape:
{
  "shop": "name of shop / store / supermarket",
  "date": "YYYY-MM-DD or null if not visible",
  "total": <grand total as a plain number, no currency symbol>,
  "currency": "IDR",
  "items": [
    { "name": "item description", "qty": <number>, "price": <line total as a plain number> }
  ]
}

Rules:
- "price" per item is the line total (unit price × qty), not the unit price alone
- If the grand total is not clearly readable, sum the item prices yourself
- Strip all currency symbols and thousand separators from numbers (e.g. "Rp 12.500" → 12500)
- If this image is not a receipt, return: {"error":"Not a receipt"}
- Return ONLY the JSON object.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } },
            { type: 'text', text: prompt },
          ],
        }],
      }),
    });

    const claude = await res.json();

    if (!res.ok) {
      return {
        statusCode: 502,
        headers: CORS,
        body: JSON.stringify({ error: 'Claude API error', detail: claude.error || claude }),
      };
    }

    const text = (claude.content?.[0]?.text || '').trim();

    // Validate parseable JSON before returning
    JSON.parse(text);

    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: text };

  } catch (err) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
