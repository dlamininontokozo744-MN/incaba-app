
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: 'No message received' });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_KEY}`,
        'HTTP-Referer': 'https://incaba-eswatini.netlify.app',
        'X-Title': 'Incaba Eswatini Tourism',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [
          {

            role: 'system',
            content: `You are Vaka — the AI travel guide for the Kingdom of Eswatini. You know everything about Eswatini tourism, culture, food, wildlife and safety. Always respond helpfully with emojis.`
          },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ reply: `API Error: ${data.error.message}` });
    }

    const reply = data.choices?.[0]?.message?.content || 'No response from AI';
    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(200).json({ reply: `Error: ${error.message}` });
  }
}
