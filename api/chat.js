export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ reply: 'Method not allowed' });

  try {
    const { message } = req.body;
    const apiKey = process.env.GROQ_KEY;

    if (!apiKey) return res.status(200).json({ reply: 'NO API KEY FOUND - add GROQ_KEY to Vercel env vars' });

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'compound-beta',
        max_tokens: 500,
        messages: [
          { role: 'system', content: 'You are Vaka, an AI guide for Eswatini tourism. Be helpful and friendly with emojis.' },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();
    
    if(data.error) return res.status(200).json({ reply: 'Groq error: ' + data.error.message });
    
    const reply = data.choices?.[0]?.message?.content || 'No response from AI';
    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(200).json({ reply: 'Catch error: ' + error.message });
  }
}