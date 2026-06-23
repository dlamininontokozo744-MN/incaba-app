export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ reply: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    const apiKey = process.env.REACT_APP_ANTHROPIC;

    if (!apiKey) {
      return res.status(200).json({ reply: 'API key not configured. Please contact admin.' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: `You are Vaka — the AI travel guide for the Kingdom of Eswatini built into the Incaba Smart Tourism Platform. You know everything about Eswatini including all 4 regions (Hhohho, Manzini, Lubombo, Shiselweni), attractions like Hlane Royal Reserve, Mantenga Falls, Lobamba Royal Village, Swazi Candles Market, Malolotja Nature Reserve, Sibebe Rock and Shiselweni Region. Local food: Sishwala, Umncweba, Emasi, Tjwala. Culture: Incwala ceremony, Umhlanga Reed Dance, Marula Festival. Emergency numbers: Police 999, Ambulance 977, Fire 933. Currency Lilangeni SZL, 1 USD = E18.5. Hotels: Royal Swazi Spa, Mantengha Cultural Village, Foresters Arms, Lidwala Backpacker. Restaurants: Malandela's, Tum's George Hotel, Foresters Arms. Transport: Kombi taxis E8-25, car rental E350 per day. Always respond in a friendly helpful tone with emojis. Be proud of Eswatini and love sharing its beauty with tourists.`,
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ reply: `Error: ${data.error.message}` });
    }

    const reply = data.content?.[0]?.text || 'Please try again!';
    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(200).json({ reply: `Error: ${error.message}` });
  }

}
