// Netlify Function: search-resources
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

  const { stage, stageName, location, preference } = body;

  if (!location) {
    return { statusCode: 400, body: 'Location is required' };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: 'Server configuration error' };
  }

  const prompt = `Search for eating disorder support resources in ${location}. Stage: ${stageName}. Preference: ${preference === 'local' ? 'in-person only' : preference === 'remote' ? 'telehealth only' : 'both'}. Find 4-6 real resources. Return JSON only: {"introduction":"Brief intro","categories":[{"name":"Category","resources":[{"name":"Name","type":"In-person/Telehealth/Both","description":"What they offer","url":"website if found"}]}]}`;

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
        max_tokens: 2048,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      return { statusCode: 500, body: JSON.stringify({ error: 'Search service unavailable. Please try again.' }) };
    }

    const data = await response.json();
    
    let resultText = '';
    for (const block of data.content) {
      if (block.type === 'text') {
        resultText += block.text;
      }
    }

    let results;
    try {
      let cleanedText = resultText.trim();
      if (cleanedText.startsWith('```json')) cleanedText = cleanedText.slice(7);
      else if (cleanedText.startsWith('```')) cleanedText = cleanedText.slice(3);
      if (cleanedText.endsWith('```')) cleanedText = cleanedText.slice(0, -3);
      results = JSON.parse(cleanedText.trim());
    } catch (parseError) {
      results = {
        introduction: "We found some resources.",
        categories: [{
          name: "Search Results",
          resources: [{
            name: "Resources",
            type: "Various",
            description: resultText.substring(0, 400)
          }]
        }]
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(results)
    };

  } catch (error) {
    console.error('Function error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Search failed. Please try again.' }) };
  }
};

module.exports = { handler };
```

**Step 3: Save (Ctrl+S), then in Git Bash:**
```
git add .
```
```
git commit -m "Fix function format"
```
```
git push