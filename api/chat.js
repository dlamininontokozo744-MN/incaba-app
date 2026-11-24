// Vercel serverless function: AI guide ("Vaka").
// Groq's model catalogue changes often, so instead of one hard-coded model we try
// a list in order and use the first one that your Groq account can access.
// To force a specific model, set GROQ_MODEL in Vercel's Environment Variables.

const MODELS = [
  process.env.GROQ_MODEL,          // optional override
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
].filter(Boolean);

const SYSTEM_PROMPT =
  'You are Vaka, an AI guide for Eswatini tourism. Be helpful and friendly. ' +
  'Do not use emojis; use plain text only. Keep answers clear and reasonably short. ' +
  'If you are not sure about something such as opening hours or prices, say so and suggest confirming locally. ' +
  'In an emergency, tell the person to contact local emergency services.';

// errors that mean "this model is not usable for you", so we should try the next one
const isModelProblem = (err) => {
  const text = `${err?.code || ''} ${err?.message || ''}`.toLowerCase();
  return /model_not_found|does not exist|do not have access|decommission|no longer supported|not supported/.test(text);
};

async function askGroq(model, message, apiKey) {
  const body = {
    model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: message },
    ],
  };
  if (model.startsWith('openai/gpt-oss')) {
    // reasoning models: leave room for the answer and keep thinking short
    body.max_completion_tokens = 1500;
    body.reasoning_effort = 'low';
  } else {
    body.max_tokens = 600;
  }
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body),
  });
  return response.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ reply: 'Method not allowed' });

  try {
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(200).json({ reply: 'Please type a question for the AI guide.' });
    }

    const apiKey = process.env.GROQ_KEY;
    if (!apiKey) {
      console.error('GROQ_KEY is not set in the Vercel environment variables');
      return res.status(200).json({ reply: 'The AI guide is not set up yet. Please try again later.' });
    }

    let lastError = null;
    for (const model of MODELS) {
      const data = await askGroq(model, message.slice(0, 2000), apiKey);
      if (data.error) {
        lastError = data.error;
        console.error(`Groq error with model ${model}:`, data.error.message);
        if (isModelProblem(data.error)) continue; // try the next model
        break;                                    // key / rate-limit problems: stop
      }
      const reply = data.choices?.[0]?.message?.content?.trim();
      if (reply) return res.status(200).json({ reply });
      lastError = { message: 'empty reply from ' + model };
    }

    const rateLimited = /rate limit|too many requests|quota/i.test(lastError?.message || '');
    return res.status(200).json({
      reply: rateLimited
        ? 'The AI guide is very busy right now. Please try again in a minute.'
        : 'Sorry, the AI guide is unavailable at the moment. Please try again shortly.',
    });
  } catch (error) {
    console.error('AI handler error:', error);
    return res.status(200).json({ reply: 'Sorry, the AI guide is unavailable at the moment. Please try again shortly.' });
  }
}
