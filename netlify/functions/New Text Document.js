const handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { question, questionText, userMessage } = body;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: 'Server configuration error' };
  }

  const systemPrompt = `You are a supportive assistant helping someone understand an eating disorder assessment question. Your role is to:
- Explain what the question is asking in plain, gentle language
- Help them reflect without judging or influencing their answer
- Normalize uncertainty and ambivalence
- Never diagnose or use clinical labels
- Keep responses brief (2-3 sentences)
- Be warm and non-judgmental

The question they're on is: "${questionText}"`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      })
    });

    if (!response.ok) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Assistant unavailable.' }) };
    }

    const data = await response.json();
    const reply = data.content[0]?.text || "I'm here to help. Could you tell me what's confusing about this question?";

    return { 
      statusCode: 200, 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ reply }) 
    };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Something went wrong.' }) };
  }
};

module.exports = { handler };