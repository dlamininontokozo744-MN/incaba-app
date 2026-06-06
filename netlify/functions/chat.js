
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message } = JSON.parse(event.body);

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
            content: `You are Vaka — the AI travel guide for the Kingdom of Eswatini, built into the Incaba Smart Tourism Platform. You know everything about Eswatini including all 4 regions (Hhohho, Manzini, Lubombo, Shiselweni), attractions like Hlane Royal Reserve, Mantenga Falls, Lobamba Royal Village, Swazi Candles Market, Malolotja Nature Reserve, Sibebe Rock. Local food: Sishwala, Umncweba, Emasi, Tjwala. Culture: Incwala ceremony, Umhlanga Reed Dance. Emergency numbers: Police 999, Ambulance 977. Currency: Lilangeni SZL, 1 USD = E18.5. Always respond in a friendly helpful tone 

with emojis. Be proud of Eswatini and love sharing its beauty.`
          },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I could not get a response. Please try again!";

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: "Ngiyaxolisa! I am having trouble right now. Please try again! 🙏" })
    };
  }
};
